var addButton = document.getElementById("addBtn");
var editButton = document.getElementById("editBtn");
var submitButton = document.getElementById("submitBtn");
var movieAdder = document.getElementById("movieAdder");
var movieEditor = document.getElementById("movieEditor");
var movieList = document.getElementById("movielist");
var overlay = document.getElementById("overlay");
var editMoviePopup = document.getElementById("editMoviePopup");

// Inputs for adding movies
var titleInput = document.getElementById("title_input");
var directorInput = document.getElementById("director_input");
var dateInput = document.getElementById("date_input");
var genreInput = document.getElementById("genre_input");
var ratingInput = document.getElementById("rating_input");

// Inputs for editing movies
var editTitleInput = document.getElementById("edit_title_input");
var editDirectorInput = document.getElementById("edit_director_input");
var editDateInput = document.getElementById("edit_date_input");
var editGenreInput = document.getElementById("edit_genre_input");
var editRatingInput = document.getElementById("edit_rating_input");

//inputs for login page
var loginButton = document.getElementById("login");
var loginPopup = document.getElementById("loginPopup");
var username_input = document.getElementById("username");
var password_input = document.getElementById("password");
var addUser = document.getElementById("addUser");
var registerButton = document.getElementById("registerButton");
var backToLoginButton = document.getElementById("backToLoginBtn");
var logoutButton = document.getElementById("logOut");
var loginWarning = document.getElementById("Lwarning");
var registerWarning = document.getElementById("Rwarning");

addUser.onclick = function () {
  document.getElementById("registerPopup").style.display = "block";
  document.getElementById("loginPopup").style.display = "none";
};

backToLoginButton.onclick = function () {
  document.getElementById("registerPopup").style.display = "none";
  document.getElementById("loginPopup").style.display = "flex";
  document.getElementById("register_first_name").value = "";
  document.getElementById("register_last_name").value = "";
  document.getElementById("register_email").value = "";
  document.getElementById("register_password").value = "";
  registerWarning.style.display = "none";
};

logoutButton.onclick = function () {
  fetch("http://localhost:8080/sessions", {
    credentials: "include",
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (response) {
      if (response.status == 200) {
        console.log("logged out user");
        LogOut();
      } else {
        console.log("Logout Error");
      }
    })
    .catch(function (error) {
      console.log("Fetch Error:", error);
    });
};

loginButton.onclick = function () {
  var email = username_input.value;
  var password = password_input.value;
  var data =
    "email=" +
    encodeURIComponent(email) +
    "&password=" +
    encodeURIComponent(password);

  fetch("http://localhost:8080/sessions", {
    credentials: "include",
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then(function (response) {
    if (response.status == 201) {
      loginWarning.style.display = "none";
      hideOverlayAndPopups();
      loadallmovies();
      username_input.value = "";
      password_input.value = "";
    } else {
      loginWarning.style.display = "block";
    }
  });
};

registerButton.onclick = function () {
  var firstName = document.getElementById("register_first_name").value;
  var lastName = document.getElementById("register_last_name").value;
  var email = document.getElementById("register_email").value;
  var password = document.getElementById("register_password").value;

  var data =
    "first_name=" +
    encodeURIComponent(firstName) +
    "&last_name=" +
    encodeURIComponent(lastName) +
    "&email=" +
    encodeURIComponent(email) +
    "&password=" +
    encodeURIComponent(password);

  fetch("http://localhost:8080/users", {
    credentials: "include",
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then(function (response) {
    if (response.status === 201) {
      registerWarning.style.display = "none";
      document.getElementById("registerPopup").style.display = "none";
      document.getElementById("register_first_name").value = "";
      document.getElementById("register_last_name").value = "";
      document.getElementById("register_email").value = "";
      document.getElementById("register_password").value = "";
      document.getElementById("registerPopup").style.display = "none";
      document.getElementById("loginPopup").style.display = "flex";
    } else if (response.status === 422) {
      registerWarning.style.display = "block";
    } else {
      console.alert("An error occurred. Please try again later.");
    }
  });
};

window.onload = function () {
  document.getElementById("fullPageOverlay").style.display = "block";
  document.getElementById("loginPopup").style.display = "flex";
};

function LogOut() {
  document.getElementById("registerPopup").style.display = "none";
  document.getElementById("loginPopup").style.display = "flex";
  document.getElementById("fullPageOverlay").style.display = "block";
  document.getElementById("overlay").style.display = "none";
}
function hideOverlayAndPopups() {
  document.getElementById("registerPopup").style.display = "none";
  document.getElementById("loginPopup").style.display = "none";
  document.getElementById("fullPageOverlay").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

addButton.onclick = function () {
  movieAdder.style.display = "block";
  overlay.style.display = "block";
};

var isEditing = false;

editButton.onclick = function () {
  isEditing = !isEditing;

  if (isEditing) {
    editButton.textContent = "Done Editing";
    document.querySelector("header").style.backgroundColor = "#f56a6a";
    document
      .querySelectorAll(".edit-button, .delete-button")
      .forEach(function (button) {
        button.style.display = "block";
      });
    addButton.style.display = "none";
  } else {
    editButton.textContent = "Edit Movies";
    document.querySelector("header").style.backgroundColor = "#333";
    document
      .querySelectorAll(".edit-button, .delete-button")
      .forEach(function (button) {
        button.style.display = "none";
      });
    addButton.style.display = "inline-block";
  }
};

var editSubmitButton = document.getElementById("editSubmitBtn");
editSubmitButton.onclick = function () {
  if (currentEditingMovieId) {
    updateMovieOnServer(currentEditingMovieId);
  } else {
    console.error("No movie selected for editing.");
  }
};

// POST
submitButton.onclick = function () {
  var data = "title=" + encodeURIComponent(titleInput.value);
  data += "&director=" + encodeURIComponent(directorInput.value);
  data += "&date=" + encodeURIComponent(dateInput.value);
  data += "&genre=" + encodeURIComponent(genreInput.value);
  data += "&rating=" + encodeURIComponent(ratingInput.value);

  console.log("Data to be sent to the server: ", data);

  fetch("http://localhost:8080/movies", {
    credentials: "include",
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then(function (response) {
    console.log("movie created");
    loadallmovies();
    closeAdder();
  });
};

// GET
function loadallmovies() {
  fetch("http://localhost:8080/movies", {
    credentials: "include",
  }).then(function (response) {
    console.log("response received");

    if (response.status != 401) {
      hideOverlayAndPopups();

      response.json().then(function (data) {
        console.log("response data received:", data);

        var movieData = data;

        // Clear the existing list
        movieList.innerHTML = "";

        movieData.forEach(function (movie) {
          var newListItem = document.createElement("li");

          var titleDiv = document.createElement("div");
          titleDiv.innerHTML = movie.title;
          titleDiv.classList.add("movie-title");
          newListItem.appendChild(titleDiv);

          var directorDiv = document.createElement("div");
          directorDiv.innerHTML = movie.director;
          newListItem.appendChild(directorDiv);

          var dateDiv = document.createElement("div");
          dateDiv.innerHTML = movie.date;
          newListItem.appendChild(dateDiv);

          var genreDiv = document.createElement("div");
          genreDiv.innerHTML = movie.genre;
          newListItem.appendChild(genreDiv);

          var ratingDiv = document.createElement("div");
          ratingDiv.innerHTML = movie.rating;
          newListItem.appendChild(ratingDiv);

          var editButton = document.createElement("button");
          editButton.innerHTML = "Edit";
          editButton.className = "edit-button";
          editButton.onclick = function () {
            openEditor(movie);
          };
          newListItem.appendChild(editButton);

          var deleteButton = document.createElement("button");
          deleteButton.innerHTML = "X";
          deleteButton.className = "delete-button";
          deleteButton.onclick = function () {
            var isConfirmed = confirm(
              "Are you sure you want to delete this movie?"
            );

            if (isConfirmed) {
              deleteMovieFromServer(movie.id);
            }
          };
          newListItem.appendChild(deleteButton);

          movieList.appendChild(newListItem);
          console.log("Movie added to list");
        });

        if (isEditing) {
          document
            .querySelectorAll(".edit-button, .delete-button")
            .forEach(function (button) {
              button.style.display = "block";
            });
        }
        setRandomBackgroundColors();
      });
    }
  });
}

function closeAdder() {
  movieAdder.style.display = "none";
  overlay.style.display = "none";
}
//DELETE
function deleteMovieFromServer(movieId) {
  fetch("http://localhost:8080/movies/" + movieId, {
    credentials: "include",
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then(function (response) {
    if (response.ok) {
      console.log("Movie deleted successfully");
      loadallmovies();
    } else {
      console.log("Failed to delete movie");
    }
  });
}

var currentEditingMovieId;

function openEditor(movieData) {
  editMoviePopup.style.display = "block";
  document.getElementById("edit_title_input").value = movieData.title;
  document.getElementById("edit_director_input").value = movieData.director;
  document.getElementById("edit_date_input").value = movieData.date;
  document.getElementById("edit_genre_input").value = movieData.genre;
  document.getElementById("edit_rating_input").value = movieData.rating;

  currentEditingMovieId = movieData.id; // Store the ID of the movie you're editing
}

function closeEditor() {
  editMoviePopup.style.display = "none";
}
//PUT
function updateMovieOnServer(movieId) {
  var data =
    "title=" +
    encodeURIComponent(document.getElementById("edit_title_input").value);
  data +=
    "&director=" +
    encodeURIComponent(document.getElementById("edit_director_input").value);
  data +=
    "&date=" +
    encodeURIComponent(document.getElementById("edit_date_input").value);
  data +=
    "&genre=" +
    encodeURIComponent(document.getElementById("edit_genre_input").value);
  data +=
    "&rating=" +
    encodeURIComponent(document.getElementById("edit_rating_input").value);

  console.log("Data sent to server for update:", data);

  fetch("http://localhost:8080/movies/" + movieId, {
    credentials: "include",
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then(function (response) {
    if (response.ok) {
      console.log("Movie updated successfully");
      loadallmovies();
      closeEditor();
    } else {
      console.log("Failed to update movie");
    }
  });
}
function closeEditPopup() {
  editMoviePopup.style.display = "none";
  overlay.style.display = "none";
  currentEditingMovieId = null;
}

function setRandomBackgroundColors() {
  console.log("Setting random background colors...");
  const colors = [
    ["#FF6B6B", "#FFA5A5"], // Vibrant Red
    ["#34e89e", "#0f3443"], // Emerald Water
    ["#ff0084", "#33001b"], // Love and Liberty
    ["#f7971e", "#ffd200"], // Sunny Morning
    ["#1f4037", "#99f2c8"], // Tranquil
    ["#c31432", "#240b36"], // Transfile
    ["#5f2c82", "#49a09d"], // Sublime Light
    ["#8360c3", "#2ebf91"], // Relaxing Red
    ["#ff0844", "#ffb199"], // Peach
    ["#c94b4b", "#4b134f"], // Horizon
    ["#23074d", "#cc5333"], // Scarlet Aesthetics
    ["#3a1c71", "#d76d77"], // Pink Flavour
    ["#5a3f37", "#2c7744"], // Green to Dark
    ["#fc4a1a", "#f7b733"], // Sunset
    ["#00c6ff", "#0072ff"], // Blue Skies
  ];

  document.querySelectorAll("#movielist li").forEach((card) => {
    var randomColorPair = colors[Math.floor(Math.random() * colors.length)];
    card.style.background = `linear-gradient(135deg, ${randomColorPair[0]} 0%, ${randomColorPair[1]} 100%)`;
    card.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.1)";
    card.offsetHeight;
  });
}

loadallmovies();
