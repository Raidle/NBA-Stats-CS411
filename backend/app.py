from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# CORS = "Cross-Origin Resource Sharing"
# React runs on port 3000, Flask on port 5000 - they're different "origins"
# Without CORS, the browser blocks React from talking to Flask (security feature)
# This line says "it's okay, let port 3000 talk to me"
CORS(app)


@app.route('/')
def index():
    return "Hello World!"


if __name__ == '__main__':
    app.run(debug=True)
