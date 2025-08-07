#!/usr/bin/env python3
"""
Configuration helper script for Beer Study Application
Use this script to easily switch between similarity and LLM predictors.
"""

import os
import sys

def show_current_config():
    """Show current configuration from .env file."""
    env_file = '.env'
    if not os.path.exists(env_file):
        print("❌ .env file not found. Please copy .env.example to .env first.")
        return False
    
    print("🔧 Current Configuration:")
    print("-" * 30)
    
    with open(env_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                if 'PREDICTOR_TYPE' in line:
                    predictor = line.split('=')[1]
                    print(f"📊 Predictor: {predictor}")
                elif 'OPENAI_API_KEY' in line and not line.startswith('OPENAI_API_KEY=your_'):
                    key = line.split('=')[1]
                    masked_key = f"{key[:8]}...{key[-8:]}" if len(key) > 16 else "***"
                    print(f"🔑 OpenAI Key: {masked_key}")
                elif 'OPENAI_MODEL' in line:
                    model = line.split('=')[1]
                    print(f"🤖 Model: {model}")
    
    return True

def update_predictor_type(predictor_type):
    """Update the PREDICTOR_TYPE in .env file."""
    env_file = '.env'
    if not os.path.exists(env_file):
        print("❌ .env file not found. Please copy .env.example to .env first.")
        return False
    
    # Read current content
    with open(env_file, 'r') as f:
        lines = f.readlines()
    
    # Update PREDICTOR_TYPE line
    updated = False
    for i, line in enumerate(lines):
        if line.strip().startswith('PREDICTOR_TYPE='):
            lines[i] = f'PREDICTOR_TYPE={predictor_type}\n'
            updated = True
            break
    
    if not updated:
        # Add PREDICTOR_TYPE if not found
        lines.append(f'PREDICTOR_TYPE={predictor_type}\n')
    
    # Write back to file
    with open(env_file, 'w') as f:
        f.writelines(lines)
    
    print(f"✅ Updated PREDICTOR_TYPE to: {predictor_type}")
    return True

def main():
    """Main configuration interface."""
    print("🍺 Beer Study Predictor Configuration")
    print("=" * 50)
    
    if len(sys.argv) > 1:
        # Command line argument provided
        arg = sys.argv[1].lower()
        if arg in ['similarity', 'llm']:
            update_predictor_type(arg)
            print()
            show_current_config()
        elif arg == 'show':
            show_current_config()
        else:
            print(f"❌ Invalid argument: {arg}")
            print("✅ Valid options: similarity, llm, show")
    else:
        # Interactive mode
        show_current_config()
        print()
        
        print("🔄 Switch Predictor:")
        print("1. similarity - Fast, offline, similarity-based matching")
        print("2. llm       - AI-powered, requires OpenAI API key")
        print("3. show      - Show current configuration")
        print("4. exit      - Exit without changes")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == '1' or choice.lower() == 'similarity':
            update_predictor_type('similarity')
        elif choice == '2' or choice.lower() == 'llm':
            update_predictor_type('llm')
            print()
            print("⚠️  Note: LLM predictor requires OPENAI_API_KEY in .env file")
            print("   Get your API key from: https://platform.openai.com/api-keys")
        elif choice == '3' or choice.lower() == 'show':
            print()
            show_current_config()
        elif choice == '4' or choice.lower() == 'exit':
            print("👋 Goodbye!")
        else:
            print("❌ Invalid choice. Please enter 1-4.")
    
    print()
    print("🚀 To apply changes, restart the Flask application:")
    print("   python app.py")

if __name__ == "__main__":
    main()
