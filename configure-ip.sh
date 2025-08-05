#!/bin/bash

# IP Configuration Helper Script for Beer Study Application

echo "🍺 Beer Study Application - IP Configuration Helper"
echo "=================================================="
echo ""

# Function to detect IP address
detect_ip() {
    echo "🔍 Detecting your network IP address..."
    echo ""
    
    # Try different methods to get IP
    IP_CANDIDATES=$(ip addr show | grep -E "inet [0-9]" | grep -v "127.0.0.1" | awk '{print $2}' | cut -d'/' -f1)
    
    if [ -z "$IP_CANDIDATES" ]; then
        echo "❌ Could not automatically detect IP address."
        echo "Please find your IP manually and update config.env"
        exit 1
    fi
    
    echo "📍 Found these IP addresses:"
    echo "$IP_CANDIDATES" | nl -w2 -s') '
    echo ""
    
    # If only one IP, use it automatically
    IP_COUNT=$(echo "$IP_CANDIDATES" | wc -l)
    if [ "$IP_COUNT" -eq 1 ]; then
        SELECTED_IP="$IP_CANDIDATES"
        echo "✅ Using IP address: $SELECTED_IP"
    else
        echo "Please select your network IP address (usually 10.x.x.x or 192.168.x.x):"
        read -p "Enter selection (1-$IP_COUNT): " SELECTION
        SELECTED_IP=$(echo "$IP_CANDIDATES" | sed -n "${SELECTION}p")
        
        if [ -z "$SELECTED_IP" ]; then
            echo "❌ Invalid selection. Exiting."
            exit 1
        fi
        
        echo "✅ Selected IP address: $SELECTED_IP"
    fi
}

# Function to update config.env
update_config() {
    if [ -f "config.env" ]; then
        # Backup existing config
        cp config.env config.env.backup
        echo "📄 Backed up existing config to config.env.backup"
    fi
    
    # Update IP address in config.env
    sed -i "s/IP_ADDRESS=.*/IP_ADDRESS=$SELECTED_IP/" config.env
    echo "✅ Updated config.env with IP address: $SELECTED_IP"
}

# Function to show current configuration
show_config() {
    echo ""
    echo "📋 Current configuration:"
    echo "========================"
    if [ -f "config.env" ]; then
        # Parse config file (shell-agnostic)
        IP_ADDRESS=$(grep "^IP_ADDRESS=" config.env | cut -d'=' -f2)
        BACKEND_PORT=$(grep "^BACKEND_PORT=" config.env | cut -d'=' -f2)
        FRONTEND_PORT=$(grep "^FRONTEND_PORT=" config.env | cut -d'=' -f2)
        
        API_URL="http://${IP_ADDRESS}:${BACKEND_PORT}"
        FRONTEND_URL="http://${IP_ADDRESS}:${FRONTEND_PORT}"
        
        echo "• IP Address: $IP_ADDRESS"
        echo "• Backend URL: $API_URL"
        echo "• Frontend URL: $FRONTEND_URL"
    else
        echo "❌ config.env not found!"
    fi
}

# Function to test connectivity
test_connectivity() {
    echo ""
    echo "🔬 Testing connectivity..."
    
    if [ -f "config.env" ]; then
        # Parse config file (shell-agnostic)
        IP_ADDRESS=$(grep "^IP_ADDRESS=" config.env | cut -d'=' -f2)
        BACKEND_PORT=$(grep "^BACKEND_PORT=" config.env | cut -d'=' -f2)
        
        # Test if port is available
        if command -v nc >/dev/null 2>&1; then
            if nc -z $IP_ADDRESS $BACKEND_PORT 2>/dev/null; then
                echo "✅ Backend port $BACKEND_PORT is accessible on $IP_ADDRESS"
            else
                echo "⚠️  Backend port $BACKEND_PORT is not accessible (this is normal if backend is not running)"
            fi
        else
            echo "ℹ️  Install netcat (nc) to test port connectivity"
        fi
    fi
}

# Main menu
case "${1:-menu}" in
    "detect")
        detect_ip
        update_config
        show_config
        test_connectivity
        ;;
    "show")
        show_config
        ;;
    "test")
        test_connectivity
        ;;
    "menu"|*)
        echo "Usage:"
        echo "  ./configure-ip.sh detect  - Detect and update IP address"
        echo "  ./configure-ip.sh show    - Show current configuration"
        echo "  ./configure-ip.sh test    - Test connectivity"
        echo ""
        echo "Quick setup:"
        echo "1. Run: ./configure-ip.sh detect"
        echo "2. Start backend: cd backend && ./start.sh"
        echo "3. Start frontend: ./start-frontend.sh"
        ;;
esac
