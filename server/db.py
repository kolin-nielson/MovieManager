import sqlite3
from passlib.hash import bcrypt


def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}


class moviesDB:
    def __init__(self):
        self.connection = sqlite3.connect("movies_db.db")
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()
        self.create_table()

    def create_table(self):
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS movies (
                id INTEGER PRIMARY KEY,
                title TEXT,
                director TEXT,
                date TEXT,
                genre TEXT,
                rating TEXT
            );
        """
        )
        self.connection.commit()

    def createMovie(self, title, director, date, genre, rating):
        data = [title, director, date, genre, rating]
        self.cursor.execute(
            "INSERT INTO movies (title, director, date, genre, rating) VALUES (?, ?, ?, ?, ?)",
            data,
        )
        self.connection.commit()

    def getMovies(self):
        self.cursor.execute("SELECT * FROM movies")
        movies = self.cursor.fetchall()
        return movies

    def getMovie(self, movie_id):
        data = [movie_id]
        self.cursor.execute("SELECT * FROM movies WHERE id = ?", data)
        Movie = self.cursor.fetchone()
        return Movie

    def deleteMovie(self, movie_id):
        data = [movie_id]
        self.cursor.execute("DELETE FROM movies WHERE id = ?", data)
        self.connection.commit()

    def updateMovie(self, movie_id, title, director, date, genre, rating):
        data = [title, director, date, genre, rating, movie_id]
        self.cursor.execute(
            "UPDATE movies SET title = ?, director = ?, date = ?, genre = ?, rating = ? WHERE id = ?",
            data,
        )
        self.connection.commit()


class UserDB:
    def __init__(self):
        self.connection = sqlite3.connect("users_db.db")
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()
        self.create_table()

    def create_table(self):
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                encrypted_password TEXT NOT NULL
            );
        """
        )
        self.connection.commit()

    def createUser(self, first_name, last_name, email, encrypted_password):
        data = [first_name, last_name, email, encrypted_password]
        self.cursor.execute(
            "INSERT INTO users (first_name, last_name, email, encrypted_password) VALUES (?, ?, ?, ?)",
            data,
        )
        self.connection.commit()

    def getUsers(self):
        self.cursor.execute("SELECT * FROM users")
        users = self.cursor.fetchall()
        return users

    def getUser(self, user_id):
        data = [user_id]
        self.cursor.execute("SELECT * FROM users WHERE id = ?", data)
        user = self.cursor.fetchone()
        return user
    
    def getUserByEmail(self, email):
        self.cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        return self.cursor.fetchone()
        

    def deleteUser(self, user_id):
        data = [user_id]
        self.cursor.execute("DELETE FROM users WHERE id = ?", data)
        self.connection.commit()

    def updateUser(self, user_id, first_name, last_name, email, encrypted_password):
        data = [first_name, last_name, email, encrypted_password, user_id]
        self.cursor.execute(
            "UPDATE users SET first_name = ?, last_name = ?, email = ?, encrypted_password = ? WHERE id = ?",
            data,
        )
        self.connection.commit()
