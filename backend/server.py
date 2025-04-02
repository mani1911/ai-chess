from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

# Replace with your actual API key, or set it as an environment variable
API_KEY = os.environ.get("GOOGLE_API_KEY")

# print(API_KEY)
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

@app.route('/generate', methods=['POST'])
def generate_text():
    """
    Endpoint to generate text using the Gemini API.
    """
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        
        generation_config = {
            "temperature": 0.8,
            "top_p": 0.9,
            "max_output_tokens": 200,
            "stop_sequences": ["\n\n"]
        }

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        response = model.generate_content(prompt, generation_config=generation_config)
        return jsonify({'result': response.text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True) # Set debug=False in production