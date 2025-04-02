from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
CORS(app)

# Replace with your actual API key, or set it as an environment variable
GEMINI_API_KEY = os.environ.get("GOOGLE_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# print(API_KEY)
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.0-flash')
openai_model = OpenAI(api_key=OPENAI_API_KEY)

@app.route('/generate', methods=['POST'])
def generate_text():
    """
    Endpoint to generate text using the Gemini API.
    """
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        llm = data.get('model')
        
        if llm == 'gemini':
            generation_config = {
                "temperature": 0.8,
                "top_p": 0.9,
                "max_output_tokens": 200,
                "stop_sequences": ["\n\n"]
            }

            if not prompt:
                return jsonify({'error': 'Prompt is required'}), 400
            
            response = gemini_model.generate_content(prompt, generation_config=generation_config)
            return jsonify({'result': response.text})

        elif llm == "openai":
            response = openai_model.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.8,
            n=1,
            stop=None 
        )
            if response.choices and response.choices[0].message:
                generated_text = response.choices[0].message.content.strip()
                return jsonify({'result': generated_text})

            return jsonify({'result': ""})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True) # Set debug=False in production