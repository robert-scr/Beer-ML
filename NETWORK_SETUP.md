# 🍺 Beer Study Application - Network Configuration

## One-File Configuration System

You now only need to edit **ONE FILE** to change the IP address: `config.env`

## Quick Setup

### 1. Update IP Address (Only Step Needed!)
Edit `config.env` and change the IP address:
```bash
IP_ADDRESS=YOUR_NEW_IP_ADDRESS
```

### 2. Start Application
```bash
# Terminal 1: Backend
cd backend
./start.sh

# Terminal 2: Frontend
./start-frontend.sh
```

## Automatic Magic ✨

The scripts automatically:
- ✅ Read your IP from `config.env`
- ✅ Generate frontend `.env.local` file
- ✅ Configure backend networking
- ✅ Display the correct URLs

## Helper Commands

```bash
# Find your IP and update config automatically
./configure-ip.sh detect

# Show current configuration
./configure-ip.sh show

# Test connectivity
./configure-ip.sh test
```

## What's Generated Automatically

1. **Frontend Environment** (`beer-ml-frontend/.env.local`):
   ```
   NEXT_PUBLIC_API_URL=http://YOUR_IP:5000
   ```

2. **Backend Configuration**: Reads IP from config and starts on correct port

3. **URL Display**: Shows the correct URLs in terminal output

## Files You Never Need to Edit

- ❌ `beer-ml-frontend/.env.local` (auto-generated)
- ❌ Any other environment files
- ❌ Hard-coded IPs in scripts

## The Only File You Edit

- ✅ `config.env` (just the IP_ADDRESS line)

## Access Your Application

- **Frontend**: http://YOUR_IP:3000 (for users)
- **Backend**: http://YOUR_IP:5000 (API endpoints)

Perfect for laptops that change networks frequently! 🎯
