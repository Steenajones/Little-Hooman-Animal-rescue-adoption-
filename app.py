from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Flask is working ✅"

# ✅ CONTACT ROUTE
@app.route("/contact", methods=["POST"])
def contact():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    print("📩 New Contact Message:")
    print(name, email, message)

    return "Message received successfully ✅"

app.run(debug=True)