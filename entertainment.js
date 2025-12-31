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
    title: "Good boy",
    meta: "2025 • English • Hindi • Korean • HDRip",
    poster: "https://i.pinimg.com/736x/3e/0f/4a/3e0f4a412a80bfa97f46d868a425e36a.jpg",
    link: "https://kdramahail.blogspot.com/2025/12/download-good-boy-season-1-multi-audio.html",
    type: "Kdrama"
  },
   {
    title: "Weak Hero (Season 1-2)",
    meta: "2025 • English • Hindi • Korean • HDRip",
    poster: "https://www.imdb.com/title/tt20234568/",
    link: "https://kdramahail.blogspot.com/2025/12/download-weak-hero-season-1-2-multi.html",
    type: "Kdrama"
  },
   {
     title: "Nice to Not Meet You (Season 1)",
    meta: "2025 • English • Hindi • Korean • HDRip",
    poster: "https://www.imdb.com/news/ni65498694/",
    link: "https://kdramahail.blogspot.com/2025/12/download-nice-to-not-meet-you-season-1.html",
    type: "Kdrama"
  },
   {
    title: "Dynamite Kiss (Season 1)",
    meta: "2025 • English • Hindi • Korean • HDRip",
    poster: "https://www.imdb.com/title/tt38353551/",
    link: "https://kdramahail.blogspot.com/2025/12/download-dynamite-kiss-season-1-dual.html",
    type: "Kdrama"
  },
  {
   title: "Cashero (Season 1)",
    meta: "2025 • English • Hindi • Korean • HDRip",
    poster: "https://www.k-ennews.com/news/articleView.html?idxno=11393",
    link: "https://kdramahail.blogspot.com/2025/12/download-cashero-season-1-multi-audio.html",
    type: "Kdrama"
  },
   {
   title: "Undercover High School (Season 1)",
    meta: "2025 • English • Hindi • Korean • HDRip",
    poster: "https://mydramalist.com/765779-undercover-high-school",
    link: "https://kdramahail.blogspot.com/2025/12/download-undercover-high-school-season.html",
    type: "Kdrama"
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


