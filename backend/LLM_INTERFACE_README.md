# LLM Interface for Beer Recommendation System

## Overview

The `llm_interface.py` module provides an LLM-based predictor that can be used as a drop-in replacement for the similarity-based algorithm in the Beer Study application.

## Features

- **Drop-in Replacement**: Compatible with the existing `BaseBeerPredictor` interface
- **Few-Shot Learning**: Uses similar user data to provide context to the LLM
- **Robust Response Processing**: Extracts beer recommendations from natural language responses
- **Confidence Scoring**: Provides confidence metrics based on response characteristics
- **Error Handling**: Graceful fallback and detailed error reporting

## Classes

### `LLMBeerPredictor`

The main predictor class that uses OpenAI's API for beer recommendations.

#### Constructor Parameters

- `api_key` (str, optional): OpenAI API key. If None, uses `OPENAI_API_KEY` environment variable
- `model` (str, default="gpt-4o-mini"): OpenAI model to use for predictions

#### Methods

- `predict(user_profile: Dict) -> Dict`: Main prediction method

## Usage

### Basic Usage

```python
from llm_interface import LLMBeerPredictor

# Initialize with API key
predictor = LLMBeerPredictor(api_key="your_openai_api_key")

# Make prediction
user_profile = {
    "age": 25,
    "gender": "female",
    "latitude": 52.5200,
    "longitude": 13.4050,
    "dark_white_chocolate": 7,
    "curry_cucumber": 3,
    "vanilla_lemon": 5,
    # ... other preferences
    "drinks_alcohol": True
}

result = predictor.predict(user_profile)
print(result)
```

### Using with Predictor Factory

```python
from predictor import get_predictor

# Get LLM predictor through factory
predictor = get_predictor('llm', api_key="your_api_key", model="gpt-4o-mini")
result = predictor.predict(user_profile)
```

### Environment Variable Configuration

```bash
export OPENAI_API_KEY="your_openai_api_key_here"
export PREDICTOR_TYPE="llm"
export OPENAI_MODEL="gpt-4o-mini"
```

```python
# Use environment variables
predictor = get_predictor('llm')  # Uses OPENAI_API_KEY from environment
```

## Response Format

The `predict()` method returns a dictionary with the following structure:

```python
{
    'success': True,                    # Boolean indicating success
    'recommended_beer': 'Beer 2',       # Recommended beer name
    'confidence': 0.9,                  # Confidence score (0-1)
    'llm_response': '...',             # Raw LLM response
    'model_used': 'gpt-4o-mini',       # Model used for prediction
    'method': 'LLM with few-shot learning'
}
```

### Error Response

```python
{
    'success': False,
    'error': 'Error message',
    'recommended_beer': None,
    'confidence': 0.0
}
```

## Integration with Existing App

To integrate the LLM predictor into your existing Flask app (`app.py`):

1. **Simple Replacement**: Change the predictor type in your route handler:

```python
# OLD
predictor = get_predictor('similarity')

# NEW  
predictor = get_predictor('llm', api_key="your_api_key")
```

2. **Configuration-Based**: Use environment variables for flexible switching:

```python
import os
from predictor import get_predictor

PREDICTOR_TYPE = os.getenv('PREDICTOR_TYPE', 'similarity')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

def get_configured_predictor():
    if PREDICTOR_TYPE == 'llm':
        return get_predictor('llm', api_key=OPENAI_API_KEY)
    else:
        return get_predictor('similarity')

# In your route
predictor = get_configured_predictor()
```

## Dependencies

- `openai`: OpenAI Python client library
- `pandas`: For data processing (via prompt_engineering module)
- `scikit-learn`: For similarity calculations (via prompt_engineering module)

## Performance Considerations

- **Latency**: LLM predictions take longer than similarity-based predictions (typically 1-3 seconds)
- **Cost**: Each prediction makes an API call to OpenAI (costs apply)
- **Rate Limits**: Subject to OpenAI API rate limits
- **Reliability**: Requires internet connection and OpenAI service availability

## Best Practices

1. **API Key Security**: Store API keys in environment variables, not in code
2. **Error Handling**: Always check the `success` field in responses
3. **Fallback Strategy**: Consider implementing fallback to similarity predictor if LLM fails
4. **Monitoring**: Monitor API usage and costs
5. **Caching**: Consider caching predictions for identical user profiles

## Testing

Run the test script to verify functionality:

```bash
cd backend
python llm_interface.py
python test_predictor_comparison.py
```

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure `OPENAI_API_KEY` is set correctly
2. **Import Errors**: Make sure all dependencies are installed
3. **Response Parsing**: The system handles various LLM response formats automatically
4. **Rate Limiting**: Implement retry logic if needed for production use

### Debug Information

The LLM predictor provides detailed error messages and includes the raw LLM response in results for debugging.

## Comparison with Similarity Predictor

| Feature | Similarity Predictor | LLM Predictor |
|---------|---------------------|---------------|
| **Speed** | Fast (~100ms) | Slower (~1-3s) |
| **Cost** | Free | API costs apply |
| **Accuracy** | Good with sufficient data | Potentially higher with few-shot learning |
| **Explainability** | High (similarity scores) | Medium (natural language response) |
| **Offline Usage** | Yes | No (requires API) |
| **Scalability** | High | Limited by API rate limits |

## Future Enhancements

- Support for other LLM providers (Anthropic, local models)
- Response caching mechanism
- Batch prediction support
- Advanced confidence scoring
- Integration with fine-tuned models
