document.addEventListener("DOMContentLoaded", () => {
  fetch("/crypto-data")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("crypto-table-body");
      data.forEach((row) => {
        const tableRow = `<tr>
          <td>${row.name}</td>
          <td>${row.last}</td>
          <td>${row.buy}</td>
          <td>${row.sell}</td>
          <td>${row.volume}</td>
          <td>${row.base_unit}</td>
        </tr>`;
        tableBody.innerHTML += tableRow;
      });
    })
    .catch((err) => console.error("Error fetching data:", err));
});

const themeToggle = document.getElementById("mode-toggle");

// Load saved theme from localStorage
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.checked = true; // Set toggle to checked for dark mode
  }
};

// Toggle theme on checkbox change
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-theme");

  // Save the theme preference
  if (themeToggle.checked) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// Timer functionality
function startTimer() {
  const timerElement = document.getElementById("timer");
  setInterval(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    timerElement.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);
}

// Start the timer on page load
startTimer();
