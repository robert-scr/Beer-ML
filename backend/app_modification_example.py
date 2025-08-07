"""
Example modification for app.py to support both similarity and LLM predictors.
This shows how to modify the existing app.py to use either predictor based on configuration.

Add this code to your app.py to support both prediction methods:
"""

import os
from predictor import get_predictor

# Add this configuration section near the top of app.py (after imports)
# Configuration for predictor selection
PREDICTOR_TYPE = os.getenv('PREDICTOR_TYPE', 'similarity')  # 'similarity' or 'llm'
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', None)  # For LLM predictor
OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'gpt-4o-mini')  # LLM model to use

def get_configured_predictor():
    """Get predictor based on environment configuration."""
    if PREDICTOR_TYPE == 'llm':
        if not OPENAI_API_KEY:
            raise ValueError("LLM predictor requires OPENAI_API_KEY environment variable")
        return get_predictor('llm', api_key=OPENAI_API_KEY, model=OPENAI_MODEL)
    else:
        return get_predictor('similarity')

# Then replace this line in your /submit_rating route:
# OLD: predictor = get_predictor('similarity')
# NEW: predictor = get_configured_predictor()

"""
Usage examples:

1. To use similarity predictor (default):
   No environment variables needed, or:
   export PREDICTOR_TYPE=similarity

2. To use LLM predictor:
   export PREDICTOR_TYPE=llm
   export OPENAI_API_KEY=your_openai_api_key_here
   export OPENAI_MODEL=gpt-4o-mini

3. In production with Docker:
   Add to your docker-compose.yml or environment:
   environment:
     - PREDICTOR_TYPE=llm
     - OPENAI_API_KEY=your_api_key
     - OPENAI_MODEL=gpt-4o-mini
"""
