const grid = document.getElementById("movieGrid");
const searchInput = document.getElementById("search");
const navButtons = document.querySelectorAll(".nav-btn");

let currentType = "all";

const movies = [
  {
    title: "Lucky Bhaskar",
    meta: "2024 • Hindi • 1080p",
    poster:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4bxibEDwwN-eElhz9M0SgdM-KUwxUmzPlwg&s",
    link: "https://www.digitaleratech.fun/2025/07/dopamine-detox-short-guide-to-remove.html",
    type: "movie"
  },
  {
    title: "interstellar",
    meta: "2014 • English • Hindi  • HDRip",
    poster: "https://www.pinterest.com/pin/photoshop-poster-interstellar--63543044733722547/",
    link: "https://www.timepaas.fun/2025/09/preparation-kit-for-automation-test.html",
    type: "movie"
  },
  {
    title: "Movie Title Four",
    meta: "Web Series • S01",
    poster: "https://via.placeholder.com/300x450?text=Poster+4",
    link: "#",
    type: "series"
  }
];

/* Render */
function renderMovies(list) {
  grid.innerHTML = "";

  list.forEach(movie => {
    const card = document.createElement("a");
    card.className = "movie-card";
    card.href = movie.link || "#";

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">
      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-meta">${movie.meta}</div>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* Filter */
function applyFilters() {
  const text = searchInput.value.toLowerCase();

  const filtered = movies.filter(movie => {
    const matchType = currentType === "all" || movie.type === currentType;
    const matchText = movie.title.toLowerCase().includes(text);
    return matchType && matchText;
  });

  renderMovies(filtered);
}

/* Nav Buttons */
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentType = btn.dataset.type;
    applyFilters();
  });
});

/* Search */
searchInput.addEventListener("input", applyFilters);

/* Initial Load */
renderMovies(movies);

