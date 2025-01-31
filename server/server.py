from flask import Flask, request, g
from db import moviesDB
from db import UserDB
from passlib.hash import bcrypt
from sessionStore import SessionStore

session_store = SessionStore()


class MyFlask(Flask):
    def add_url_rule(self, rule, endpoint=None, view_func=None, **options):
        return super().add_url_rule(
            rule, endpoint, view_func, provide_automatic_options=False, **options
        )


# Session Management
#######################################################################################################


def load_session_data():
    # load the session ID from cookie data
    session_id = request.cookies.get("session_id")

    # if session.id is present:
    if session_id:
        # load the session data using the session id
        session_data = session_store.getSession(session_id)

        # if the session id is missing or invalid:
    if session_id == None or session_data == None:
        # create a new session with a new session id
        session_id = session_store.createSession()
        # load session data using new session id
        session_data = session_store.getSession(session_id)

    # save the session ID and session data for use in other functions
    g.session_id = session_id
    g.session_data = session_data


app = MyFlask(__name__)


@app.before_request
def before_request_func():
    load_session_data()


@app.after_request
def after_request_func(response):
    print("session ID:", g.session_id)
    print("session data:", g.session_data)

    # send a cookie to the client with the session id
    response.set_cookie("session_id", g.session_id, samesite="None", secure=True)

    response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin")
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


# Preflight
#######################################################################################################


@app.route("/<path:path>", methods=["OPTIONS"])
def cors_preflight(path):
    return "", {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }


# Catch-all Route
#######################################################################################################
@app.route("/", defaults={"path": ""}, methods=["GET", "POST", "PUT", "DELETE"])
@app.route("/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
def catch_all(path):
    return ("BIG PHAT 404", 404)


# Movie Routes
#######################################################################################################
@app.route("/movies", methods=["GET"])
def retrieveMovies():
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    else:
        db = moviesDB()
        movies = db.getMovies()
        return movies


@app.route("/movies/<int:movie_id>", methods=["GET"])
def retrieveMovie(movie_id):
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    
    db = moviesDB()
    movie = db.getMovie(movie_id)
    if movie:
        return movie, 200
    else:
        return (
            "Movie ID {} not found".format(movie_id),
            404,
        )


@app.route("/movies", methods=["POST"])
def createMovies_Lists():
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    
    db = moviesDB()
    db.createMovie(
        request.form["title"],
        request.form["director"],
        request.form["date"],
        request.form["genre"],
        request.form["rating"],
    )
    return "Created", 201


@app.route("/movies/<int:movie_id>", methods=["DELETE"])
def deleteMovie(movie_id):
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    
    db = moviesDB()
    deleted_movie = db.getMovie(movie_id)

    if deleted_movie:
        db.deleteMovie(movie_id)
        return "Deleted", 200
    else:
        return "", 404


@app.route("/movies/<int:movie_id>", methods=["PUT"])
def updateMovie(movie_id):
    if "user_id" not in g.session_data:
        return "Unauthorized", 401
    
    db = moviesDB()
    db.updateMovie(
        movie_id,
        request.form["title"],
        request.form["director"],
        request.form["date"],
        request.form["genre"],
        request.form["rating"],
    )

    exists = db.getMovie(movie_id)

    if exists:
        return "Updated", 200
    else:
        return "ID Doesn't exist", 404


# User Authentication Routes
#######################################################################################################


@app.route("/users", methods=["POST"])
def register_user():
    db = UserDB()
    email = request.form["email"]
    password = bcrypt.hash(request.form["password"])
    first_name = request.form["first_name"]
    last_name = request.form["last_name"]

    if db.getUserByEmail(email):
        return "Email already in use", 422

    db.createUser(first_name, last_name, email, password)
    return "User registered successfully", 201


@app.route("/sessions", methods=["POST"])
def loginUser():
    db = UserDB()
    session = SessionStore()
    user = db.getUserByEmail(request.form["email"])
    if user:
        if bcrypt.verify(request.form["password"], user["encrypted_password"]):
            g.session_data["user_id"] = session.createSession()

            return "Session Created", 201
        else:
            return "Unauthorized", 401
    else:
        return "Unauthorized", 401


@app.route("/sessions", methods=["DELETE"])
def logout_user():
    if "user_id" not in g.session_data:
        return "Unauthorized", 401

    del g.session_data["user_id"]
    return "Deleted", 200


def run():
    app.run(port=8080)


if __name__ == "__main__":
    run()
