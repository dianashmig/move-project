
const API_KEY = "edf58e3";
const API_URL = "https://www.omdbapi.com/";

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const moviesGrid = document.getElementById("moviesGrid");
const resultsInfo = document.getElementById("resultsInfo");
const sortSelect = document.getElementById("sortSelect");


let movies = [];


async function fetchMovies(searchTerm) {

    moviesGrid.innerHTML = "<p>Loading movies...</p>";
    resultsInfo.textContent = `Searching for: ${searchTerm}`;

    try {

        const response = await fetch(
            `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`
        );

        const data = await response.json();

        if (data.Response === "True") {

            movies = data.Search;

            resultsInfo.textContent = `Showing: ${searchTerm} (${data.totalResults} results)`;

            displayMovies(getSortedMovies());

        } else {

            movies = [];

            moviesGrid.innerHTML = `<p>${data.Error}</p>`;

            resultsInfo.textContent = "No results found.";

        }

    } catch (error) {

        console.error("Error fetching movies:", error);

        moviesGrid.innerHTML = "<p>Something went wrong. Please try again.</p>";

        resultsInfo.textContent = "Search failed.";

    }

}


function displayMovies(movieList) {

    if (movieList.length === 0) {

        moviesGrid.innerHTML = "<p>No movies to display.</p>";
        return;

    }

    moviesGrid.innerHTML = movieList.map(movie => {

        const poster = movie.Poster !== "N/A" && movie.Poster
            ? `<img class="movie-card__img" src="${movie.Poster}" alt="${movie.Title} poster">`
            : `<div class="movie-card__poster-placeholder">Movie Poster<br>Not Available</div>`;

        return `
            <div class="movie-card">

                ${poster}

                <h2 class="movie-card__title">
                    ${movie.Title}
                </h2>

                <p class="movie-card__year">
                    ${movie.Year}
                </p>

            </div>
        `;

    }).join("");

}


function getSortedMovies() {

    const sortValue = sortSelect.value;

    const sortedMovies = [...movies];

    switch (sortValue) {

        case "a-z":

            sortedMovies.sort((a, b) =>
                a.Title.localeCompare(b.Title)
            );

            break;

        case "z-a":

            sortedMovies.sort((a, b) =>
                b.Title.localeCompare(a.Title)
            );

            break;

        case "newest":

            sortedMovies.sort((a, b) =>
                getMovieYear(b.Year) - getMovieYear(a.Year)
            );

            break;

        case "oldest":

            sortedMovies.sort((a, b) =>
                getMovieYear(a.Year) - getMovieYear(b.Year)
            );

            break;

        default:

            return movies;

    }

    return sortedMovies;

}

// Extract the first four-digit year from the API result.
function getMovieYear(year) {

    const match = year.match(/\d{4}/);

    return match ? Number(match[0]) : 0;

}


searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (searchTerm) {

        fetchMovies(searchTerm);

    }

});


sortSelect.addEventListener("change", function() {

    displayMovies(getSortedMovies());

});


fetchMovies("Marvel");
