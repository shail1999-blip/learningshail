// const data = [
//     {
//         title: "Inception",
//         rating: "8.8",
//         type: "movie",
//         poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg"
//     },
//     {
//         title: "Interstellar",
//         rating: "8.6",
//         type: "movie",
//         poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
//     },
//     {
//         title: "The Dark Knight",
//         rating: "9.0",
//         type: "movie",
//         poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
//     },
//     {
//         title: "Breaking Bad",
//         rating: "9.5",
//         type: "series",
//         poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg"
//     },
//     {
//         title: "Stranger Things",
//         rating: "8.7",
//         type: "series",
//         poster: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg"
//     }
// ];

const container = document.getElementById("movieContainer");
const searchInput = document.getElementById("search");
const navButtons = document.querySelectorAll(".nav-btn");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

let currentType = "all";

/* Display */
function displayItems(list) {
    container.innerHTML = "";
    list.forEach(item => {
        container.innerHTML += `
            <div class="movie">
                <img src="${item.poster}" alt="${item.title}">
                <div class="movie-info">
                    <h3>${item.title}</h3>
                    <span>⭐ ${item.rating}</span>
                </div>
            </div>
        `;
    });
}

/* Filter Logic */
function applyFilters() {
    const text = searchInput.value.toLowerCase();

    const filtered = data.filter(item => {
        const matchType = currentType === "all" || item.type === currentType;
        const matchText = item.title.toLowerCase().includes(text);
        return matchType && matchText;
    });

    displayItems(filtered);
}

/* Nav Buttons */
navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        navButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentType = btn.dataset.type;
        applyFilters();
        mobileMenu.classList.remove("show");
    });
});

/* Search */
searchInput.addEventListener("input", applyFilters);

/* Hamburger */
hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
});

/* Initial Load */
displayItems(data);
