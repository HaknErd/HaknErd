function NotifyToast(msg, type = "success") {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className =
      "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(toastContainer);
  }

  // Create the toast element with Bootstrap 5 structure
  const toastId = "toast-" + Date.now();
  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center border-0`;
  toastEl.id = toastId;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");

  // Set the background color based on type
  let bgClass = "bg-success";
  if (type === "error") {
    bgClass = "bg-danger";
  } else if (type === "info") {
    bgClass = "bg-info";
  } else if (type !== "success") {
    bgClass = "bg-secondary";
  }
  toastEl.classList.add("text-white", bgClass);

  // Create the toast content
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${msg}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  // Add the toast to the container
  toastContainer.appendChild(toastEl);

  // Initialize and show the toast using Bootstrap 5
  const toast = new bootstrap.Toast(toastEl, {
    animation: true,
    autohide: true,
    delay: 3000,
  });
  toast.show();

  // Remove the toast element after it's hidden
  toastEl.addEventListener("hidden.bs.toast", function () {
    toastEl.remove();
  });
}

function validateAllFields() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Check if any field is empty
  if (!name || !email || !message) {
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
  const submitBtn = form.querySelector('button[type="submit"]');
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
      form.reset();
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
