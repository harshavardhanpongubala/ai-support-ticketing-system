# Flask Server - Runs the AI service on port 5001
from flask import Flask, request, jsonify
from flask_cors import CORS
from classifier import classify_ticket

# Create Flask app
app = Flask(__name__)
CORS(app)  # Allow backend to connect to this Python server

# ============================================
# Route 1: Check if AI service is running
# GET /
# ============================================
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': '🤖 AI Classification Service is running!',
        'status': 'OK'
    })

# ============================================
# Route 2: Classify a ticket
# POST /classify
# ============================================
@app.route('/classify', methods=['POST'])
def classify():
    try:
        # Get data sent by backend
        data = request.get_json()
        title = data.get('title', '')
        description = data.get('description', '')
        
        # Call our AI classifier
        result = classify_ticket(title, description)
        
        # Send result back to backend
        return jsonify({
            'success': True,
            'category': result['category'],
            'priority': result['priority']
        })
        
    except Exception as e:
        # If error happens, return defaults
        return jsonify({
            'success': False,
            'category': 'general',
            'priority': 'medium',
            'error': str(e)
        })

# ============================================
# Start the server
# ============================================
if __name__ == '__main__':
    print("🚀 Starting AI Service on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)