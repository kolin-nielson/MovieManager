# Movie Management Web Application

This web application allows users to manage a collection of movies.

## Resource

### Movie

### Attributes

- **Title (TEXT)**: The name of the movie.
- **Director (TEXT)**: The director of the movie.
- **Date (TEXT)**: The release date of the movie.
- **Genre (TEXT)**: The genre of the movie.
- **Rating (TEXT)**: The rating of the movie.

## Database Schema

The SQLite database schema for the movies is as follows:

```sql
CREATE TABLE movies (
    id INTEGER PRIMARY KEY,
    title TEXT,
    director TEXT,
    date TEXT,
    genre TEXT,
    rating TEXT
);
```

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    encrypted_password TEXT NOT NULL
);
```

## API Endpoints

| Name                     | Method | Path        |
| ------------------------ | ------ | ----------- |
| List Movies              | GET    | /movies     |
| Retrieve a Single Movie  | GET    | /movies/:id |
| Create a New Movie       | POST   | /movies     |
| Update an Existing Movie | PUT    | /movies/:id |
| Delete a Movie           | DELETE | /movies/:id |
| Register User            | POST   | /users      |
| Verify/login User        | POST   | /sessions   |
| Logout User              | DELETE | /sessions   |

## Features

- **List View**: Displays a list of all movies with their title and director.
- **Add/Edit Form**: Allows users to add a new movie or edit an existing one.
- **Delete Button**: Each movie has an associated delete button that prompts the user for confirmation before deletion.
- **Styling**: The application is styled using valid HTML and CSS to provide a professional and presentable look.
- **Users**: Allows creation of accounts and all fuctionality expected such as registration, login, and logout functionality
- **Password**: Passwords are safely encrypted using bcrypt and salting and stored only server side for your safety
