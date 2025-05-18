// Hamburger menu logic
const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

function openMenu() {
  sideMenu.style.display = "flex";
}
function closeSideMenu() {
  sideMenu.style.display = "none";
}
hamburger.addEventListener("click", openMenu);
hamburger.addEventListener("keydown", (e) => {
  if (e.key === "Enter") openMenu();
});
closeMenu.addEventListener("click", closeSideMenu);
closeMenu.addEventListener("keydown", (e) => {
  if (e.key === "Enter") closeSideMenu();
});

// Vue.js App for Movie Grid
new Vue({
  el: "#app",
  data: {
    searchQuery: "",
    displayedMovies: [],
    tmdbApiKey: "YOUR_TMDB_API_KEY" // <-- Replace with your TMDB API key
  },
  created() {
    // Fetch 3 movies from TVMaze API as initial dummy data
    fetch("https://api.tvmaze.com/shows")
      .then(res => res.json())
      .then(data => {
        // Use the first 3 shows as initial movies
        this.displayedMovies = data.slice(0, 3).map(show => ({
          id: show.id,
          title: show.name,
          description: show.summary ? show.summary.replace(/<[^>]+>/g, "") : "No description.",
          image: show.image ? show.image.medium : "assets/default.jpg"
        }));
      });
  },
  methods: {
    searchMovies() {
      if (!this.searchQuery.trim()) return;
      // Search TVMaze first
      fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(this.searchQuery)}`
      )
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            const show = data[0].show;
            if (!this.displayedMovies.some(m => m.id === show.id)) {
              this.displayedMovies.push({
                id: show.id,
                title: show.name,
                description: show.summary ? show.summary.replace(/<[^>]+>/g, "") : "No description.",
                image: show.image ? show.image.medium : "assets/default.jpg"
              });
            }
          } else {
            // If not found in TVMaze, try TMDB
            fetch(
              `https://api.themoviedb.org/3/search/movie?api_key=${this.tmdbApiKey}&query=${encodeURIComponent(this.searchQuery)}`
            )
              .then(res => res.json())
              .then(data => {
                if (data.results && data.results.length > 0) {
                  const movie = data.results[0];
                  if (!this.displayedMovies.some(m => m.id === movie.id)) {
                    this.displayedMovies.push({
                      id: movie.id,
                      title: movie.title,
                      description: movie.overview || "No description.",
                      image: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                        : "assets/default.jpg"
                    });
                  }
                } else {
                  alert("No movie found!");
                }
              });
          }
        });
      this.searchQuery = "";
    },
    removeMovie(index) {
      this.displayedMovies.splice(index, 1);
    }
  }
});

// Contact Form Validation
document.getElementById("contactForm").onsubmit = function (e) {
  let valid = true;
  const requiredFields = ["firstName", "lastName", "email", "message"];
  requiredFields.forEach((id) => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.style.border = "2px solid #f00";
      valid = false;
    } else {
      el.style.border = "";
    }
  });
  if (!document.getElementById("terms").checked) {
    valid = false;
    alert("You must agree to the Terms & Conditions.");
  }
  if (!valid) {
    e.preventDefault();
    alert("Please fill all required fields.");
  }
};