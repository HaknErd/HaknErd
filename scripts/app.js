// Set default theme
if (!localStorage.getItem("theme")) {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  localStorage.setItem("theme", prefersDarkScheme.matches ? "dark" : "light");
}

// Apply saved theme
document.documentElement.setAttribute(
  "data-theme",
  localStorage.getItem("theme")
);

// Toggle light/dark theme
function toggleTheme() {
  const currentTheme = localStorage.getItem("theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Redirect to mail client if "mailto" param is valid
const urlParams = new URLSearchParams(window.location.search);
const mailto = urlParams.get("mailto");
if (mailto && isValidEmail(mailto)) {
  window.location.href = "mailto:" + mailto;
  window.close();
} else if (mailto) {
  console.error("Invalid email address provided in the mailto parameter.");
}
