function NotifyToast(msg, type = "success") {
  // Use existing toast container and template from HTML
  const toastContainer = document.querySelector(".toast-container");
  const template = document.getElementById("toast-template");
  if (!template || !toastContainer) return;

  // Clear previous toasts to avoid duplicate messages
  toastContainer.innerHTML = "";

  // Clone the template content
  const toastFragment = template.content.cloneNode(true);
  const toastEl = toastFragment.querySelector(".toast");

  // Set background class based on type
  let bgClass = "bg-success";
  if (type === "error") {
    bgClass = "bg-danger";
  } else if (type === "info") {
    bgClass = "bg-info";
  } else if (type !== "success") {
    bgClass = "bg-secondary";
  }
  toastEl.classList.add("text-white", bgClass);

  // Set the message for the toast
  toastEl.querySelector(".toast-body").textContent = msg;

  // Append to the container
  toastContainer.appendChild(toastEl);

  // After 3 seconds, fade out and remove the toast
  setTimeout(() => {
    toastEl.classList.add("hide");
    setTimeout(() => {
      toastEl.remove();
    }, 500); // allow fade transition to complete
  }, 3000);
}

function validateAllFields() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Check if any field is empty
  if (!name || !email || !message || !subject) {
    NotifyToast("Please fill out all fields.", "error");
    return false;
  }
  // Check if email is valid
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    NotifyToast("Please enter a valid email address.", "error");
    return false;
  }

  // Check if message is too short
  if (message.length < 10) {
    NotifyToast("Message must be at least 10 characters long.", "error");
    return false;
  }

  return true;
}
document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Validate all fields before proceeding
    if (!validateAllFields()) {
      return;
    }

    // Execute reCAPTCHA v3
    grecaptcha.ready(function () {
      grecaptcha
        .execute("6Lf2fAQrAAAAABoo2ger8xKy1_nlI3QOpCxoFQnG", {
          action: "submit",
        })
        .then(function (token) {
          // Add the token to the form data
          submitForm(token);
        });
    });
  });

function submitForm(recaptchaToken) {
  const form = document.getElementById("contact-form");
  const formData = new FormData(form);

  // Add the reCAPTCHA token to the formData
  formData.append("gCaptchaResponse", recaptchaToken);

  // Convert FormData to URL-encoded string
  const urlEncodedData = new URLSearchParams(formData).toString();

  const url =
    "https://script.google.com/macros/s/AKfycbz_-Pjh0yQIzyCHgKzpowhPCL-rSi42vpRetigmjES48oaB6omq1WlYgDRLexzHRK7R/exec";

  // Show loading indicator
  const submitBtn = form.querySelector('input[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

  fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlEncodedData,
  })
    .then((response) => {
      console.log("Form submitted");
      NotifyToast("Message sent successfully!", "success");
      // Clear the form after a short delay so the toast is visible
      setTimeout(() => {
        form.reset();
      }, 500);
    })
    .catch((error) => {
      console.error("Error:", error);
      NotifyToast("Failed to send message. Please try again later.", "error");
    })
    .finally(() => {
      // Restore submit button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    });
}
