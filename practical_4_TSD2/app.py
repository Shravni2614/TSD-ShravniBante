import os

# Allow HTTP for local development only
if os.environ.get("FLASK_ENV") == "development":
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import mysql.connector
import requests

from google_auth_oauthlib.flow import Flow


app = Flask(__name__)

# Secret key is required for Flask sessions
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-only-change-me")


# ==================================================
# MYSQL CONNECTION
# ==================================================

def get_db_connection():
    return mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        port=int(os.environ.get("DB_PORT", 3306)),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "aerobook"),
        ssl_ca=os.environ.get("DB_SSL_CA"),
        ssl_verify_cert=True
    )


# ==================================================
# GOOGLE OAUTH SETTINGS
# ==================================================

CLIENT_SECRETS_FILE = os.environ.get(
    "GOOGLE_CLIENT_SECRETS_FILE",
    "credentials.json"
)

GOOGLE_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
]


# ==================================================
# HOME PAGE
# ==================================================

@app.route("/")
def home():

    return render_template("index.html")


# ==================================================
# REGISTER
# ==================================================

@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:

        return jsonify({
            "success": False,
            "message": "All fields are required."
        })

    try:

        connection = get_db_connection()
        cursor = connection.cursor()

        # Check if email already exists
        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:

            cursor.close()
            connection.close()

            return jsonify({
                "success": False,
                "message": "Email already registered."
            })

        # Create new user
        cursor.execute(
            """
            INSERT INTO users (name, email, password)
            VALUES (%s, %s, %s)
            """,
            (name, email, password)
        )

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Account created successfully!"
        })

    except mysql.connector.Error as error:

        print("REGISTER DATABASE ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Database error: " + str(error)
        })


# ==================================================
# LOGIN
# ==================================================

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:

        return jsonify({
            "success": False,
            "message": "Email and password are required."
        })

    try:

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT name
            FROM users
            WHERE email = %s AND password = %s
            """,
            (email, password)
        )

        user = cursor.fetchone()

        cursor.close()
        connection.close()

        if user:

            # Save login information
            session["user_name"] = user[0]
            session["user_email"] = email

            return jsonify({
                "success": True,
                "message": f"Welcome back, {user[0]}!"
            })

        else:

            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            })

    except mysql.connector.Error as error:

        print("LOGIN DATABASE ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Database error: " + str(error)
        })


# ==================================================
# GOOGLE LOGIN
# ==================================================

@app.route("/google/login")
def google_login():

    try:

        # Create Google OAuth flow
        flow = Flow.from_client_secrets_file(
            CLIENT_SECRETS_FILE,
            scopes=GOOGLE_SCOPES
        )

        # Google will return the user here
        flow.redirect_uri = url_for(
            "google_callback",
            _external=True
        )

        # Generate Google authorization URL
        authorization_url, state = flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            prompt="select_account"
        )

        # IMPORTANT:
        # Save both state and PKCE code verifier
        # so they can be restored in the callback.
        session["state"] = state
        session["code_verifier"] = flow.code_verifier

        return redirect(authorization_url)

    except Exception as error:

        print("GOOGLE LOGIN START ERROR:", error)

        return f"Google Login Error: {error}"


# ==================================================
# GOOGLE CALLBACK
# ==================================================

@app.route("/google/callback")
def google_callback():

    try:

        # ------------------------------------------
        # Get saved OAuth information
        # ------------------------------------------

        state = session.get("state")
        code_verifier = session.get("code_verifier")

        if not state:

            return "Google Login Error: OAuth state is missing. Please try again."

        if not code_verifier:

            return "Google Login Error: Code verifier is missing. Please start Google Login again."


        # ------------------------------------------
        # Create OAuth flow again
        # ------------------------------------------

        flow = Flow.from_client_secrets_file(
            CLIENT_SECRETS_FILE,
            scopes=GOOGLE_SCOPES,
            state=state
        )

        # Set redirect URI
        flow.redirect_uri = url_for(
            "google_callback",
            _external=True
        )

        # IMPORTANT:
        # Restore the PKCE code verifier
        flow.code_verifier = code_verifier


        # ------------------------------------------
        # Exchange authorization code for token
        # ------------------------------------------

        flow.fetch_token(
            authorization_response=request.url
        )

        credentials = flow.credentials


        # ------------------------------------------
        # Get Google user information
        # ------------------------------------------

        response = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            params={
                "access_token": credentials.token
            }
        )

        if response.status_code != 200:

            return "Could not get Google user information."

        google_user = response.json()

        name = google_user.get("name")
        email = google_user.get("email")
        google_id = google_user.get("id")


        # ------------------------------------------
        # Make sure Google returned an email
        # ------------------------------------------

        if not email:

            return "Could not get Google email."


        # ------------------------------------------
        # Connect to MySQL
        # ------------------------------------------

        connection = get_db_connection()
        cursor = connection.cursor()


        # ------------------------------------------
        # Check whether user already exists
        # ------------------------------------------

        cursor.execute(
            """
            SELECT id, name
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()


        # ------------------------------------------
        # Existing User
        # ------------------------------------------

        if user:

            cursor.execute(
                """
                UPDATE users
                SET google_id = %s
                WHERE email = %s
                """,
                (google_id, email)
            )

            connection.commit()

            user_name = user[1]


        # ------------------------------------------
        # New Google User
        # ------------------------------------------

        else:

            cursor.execute(
                """
                INSERT INTO users
                (name, email, password, google_id)
                VALUES (%s, %s, NULL, %s)
                """,
                (name, email, google_id)
            )

            connection.commit()

            user_name = name


        # ------------------------------------------
        # Close MySQL connection
        # ------------------------------------------

        cursor.close()
        connection.close()


        # ------------------------------------------
        # Save login information in Flask session
        # ------------------------------------------

        session["user_name"] = user_name
        session["user_email"] = email


        # ------------------------------------------
        # Remove temporary OAuth information
        # ------------------------------------------

        session.pop("state", None)
        session.pop("code_verifier", None)


        # ------------------------------------------
        # Return to AeroBook home page
        # ------------------------------------------

        return redirect(
            url_for("home", google_login="success")
        )


    except Exception as error:

        print("GOOGLE LOGIN ERROR:", error)

        return f"Google Login Error: {error}"


# ==================================================
# LOGOUT
# ==================================================

@app.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("home"))


# ==================================================
# RUN APPLICATION
# ==================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )