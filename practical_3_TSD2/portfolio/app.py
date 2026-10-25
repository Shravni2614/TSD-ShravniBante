import os
import re
from flask import Flask, render_template, request, jsonify
from mysql.connector import connect, Error
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

if not all([DB_HOST, DB_USER, DB_PASSWORD, DB_NAME]):
    raise RuntimeError(
        "Database configuration is incomplete. Please set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in .env."
    )

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

app = Flask(__name__, static_folder="static", template_folder="templates")


def get_db_connection():
    return connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
    )


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"success": False, "message": "Invalid request format."}), 400

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    message = str(data.get("message", "")).strip()

    if not name or not email or not message:
        return jsonify({"success": False, "message": "Please fill in all fields."}), 400

    if not EMAIL_REGEX.match(email):
        return jsonify({"success": False, "message": "Please enter a valid email address."}), 400

    if len(name) > 100 or len(email) > 255 or len(message) > 2000:
        return jsonify({"success": False, "message": "One or more fields exceed the allowed length."}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = (
            "INSERT INTO contact_messages (name, email, message, created_at) "
            "VALUES (%s, %s, %s, NOW())"
        )
        cursor.execute(query, (name, email, message))
        connection.commit()
    except Error:
        return jsonify({
            "success": False,
            "message": "Unable to save your message right now. Please try again later.",
        }), 500
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        try:
            connection.close()
        except Exception:
            pass

    return jsonify({
        "success": True,
        "message": "Message sent successfully! Thank you for contacting me.",
    }), 200


if __name__ == "__main__":
    app.run(debug=True)
