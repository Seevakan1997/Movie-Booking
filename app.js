// Hamburger menu
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

// Vue.js
new Vue({
  el: "#app",
  data: {
    searchQuery: "",
    displayedMovies: [
      {
        id: 1,
        title: "Batman Returns",
        description:
          "Lorem ipsum dolor sit amet, consectetur sadipscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        image: "assets/Images/Batman.jpg",
      },
      {
        id: 2,
        title: "Wild Wild West",
        description:
          "Lorem ipsum dolor sit amet, consectetur sadipscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        image: "assets/Images/Wild West.jpg",
      },
      {
        id: 3,
        title: "The Amazing Spiderman",
        description:
          "Lorem ipsum dolor sit amet, consectetur sadipscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        image: "assets/Images/Spiderman.jpg",
      },
    ],
    tmdbApiKey: "API_KEY",
    searchResults: [],
    showDropdown: false,
    searching: false,
  },
  watch: {
    searchQuery(newVal) {
      if (newVal.trim().length > 1) {
        this.fetchSearchResults(newVal);
      } else {
        this.searchResults = [];
        this.showDropdown = false;
      }
    },
  },
  methods: {
    fetchSearchResults(query) {
      this.searching = true;
      // Search
      fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
      )
        .then((res) => res.json())
        .then((data) => {
          this.searchResults = data.map((item) => ({
            id: item.show.id,
            title: item.show.name,
            description: item.show.summary
              ? item.show.summary.replace(/<[^>]+>/g, "")
              : "No description.",
            image: item.show.image
              ? item.show.image.medium
              : "assets/default.jpg",
          }));
          this.showDropdown = this.searchResults.length > 0;
          this.searching = false;
        });
    },
    selectResult(movie) {
      if (!this.displayedMovies.some((m) => m.id === movie.id)) {
        this.displayedMovies.push(movie);
      }
      this.searchQuery = "";
      this.searchResults = [];
      this.showDropdown = false;
    },
    searchMovies() {
      if (!this.searchQuery.trim()) return;
      if (this.searchResults.length > 0) {
        this.selectResult(this.searchResults[0]);
        return;
      }
      fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(
          this.searchQuery
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            const show = data[0].show;
            if (!this.displayedMovies.some((m) => m.id === show.id)) {
              this.displayedMovies.push({
                id: show.id,
                title: show.name,
                description: show.summary
                  ? show.summary.replace(/<[^>]+>/g, "")
                  : "No description.",
                image: show.image ? show.image.medium : "assets/default.jpg",
              });
            }
          } else {
            fetch(
              `https://api.themoviedb.org/3/search/movie?api_key=${
                this.tmdbApiKey
              }&query=${encodeURIComponent(this.searchQuery)}`
            )
              .then((res) => res.json())
              .then((data) => {
                if (data.results && data.results.length > 0) {
                  const movie = data.results[0];
                  if (!this.displayedMovies.some((m) => m.id === movie.id)) {
                    this.displayedMovies.push({
                      id: movie.id,
                      title: movie.title,
                      description: movie.overview || "No description.",
                      image: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                        : "assets/default.jpg",
                    });
                  }
                } else {
                  alert("No movie found!");
                }
              });
          }
        });
      this.searchQuery = "";
      this.searchResults = [];
      this.showDropdown = false;
    },
    removeMovie(index) {
      this.displayedMovies.splice(index, 1);
    },
    hideDropdown() {
      setTimeout(() => {
        this.showDropdown = false;
      }, 200);
    },
  },
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
