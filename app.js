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
    displayedMovies: [
      {
        id: 1,
        title: "Batman Returns",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "assets/batman.jpg",
      },
      {
        id: 2,
        title: "Wild Wild West",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "assets/wildwest.jpg",
      },
      {
        id: 3,
        title: "The Amazing Spiderman",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "assets/spiderman.jpg",
      },
    ],
  },
  methods: {
    searchMovies() {
      if (!this.searchQuery.trim()) return;
      fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(
          this.searchQuery
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            const show = data[0].show;
            if (!this.displayedMovies.some((m) => m.title === show.name)) {
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
            alert("No movie found!");
          }
        });
      this.searchQuery = "";
    },
    removeMovie(index) {
      this.displayedMovies.splice(index, 1);
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
