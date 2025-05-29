// ===== Scroll Reveal Animation =====
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;
  const revealPoint = 100;

  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== Load Reviews =====
function loadReviews() {
  const reviewList = document.getElementById("reviewList");
  if (!reviewList) return;
  
  const reviews = JSON.parse(localStorage.getItem("siargaoReviews")) || [];
  reviewList.innerHTML = ""; // Clear existing reviews

  if (reviews.length === 0) {
    reviewList.innerHTML = "<p>No reviews yet.</p>";
  } else {
    reviews.forEach(({ name, text, rating }) => {
      const stars = "⭐".repeat(rating);
      const reviewHTML = `
        <div class="review-item" style="margin-bottom:15px;">
          <p class="stars" style="color:#ffc107; font-size:20px;">${stars}</p>
          <p>"${text}"</p>
          <p>- ${name}</p>
          <hr>
        </div>
      `;
      reviewList.innerHTML += reviewHTML;
    });
  }
}

document.getElementById("reviewForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("reviewerName")?.value.trim();
  const text = document.getElementById("reviewText")?.value.trim();
  const rating = document.getElementById("reviewRating")?.value;

  if (!name || !text || !rating) {
    alert("Please fill all fields!");
    return;
  }

  const review = { name, text, rating: Number(rating) };
  const reviews = JSON.parse(localStorage.getItem("siargaoReviews")) || [];
  reviews.unshift(review); // Add new review to start
  localStorage.setItem("siargaoReviews", JSON.stringify(reviews));

  this.reset();
  loadReviews();
});

// Load reviews on DOMContentLoaded
window.addEventListener("DOMContentLoaded", loadReviews);

// ===== Carousel =====
const carouselImages = document.querySelector('.carousel-images');
const leftBtn = document.querySelector('.carousel-btn.left');
const rightBtn = document.querySelector('.carousel-btn.right');
let currentIndex = 0;

if (carouselImages && leftBtn && rightBtn) {
  rightBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % carouselImages.children.length;
    updateCarousel();
  });

  leftBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + carouselImages.children.length) % carouselImages.children.length;
    updateCarousel();
  });

  function updateCarousel() {
    const offset = -currentIndex * 100;
    carouselImages.style.transform = `translateX(${offset}%)`;
  }
}

// ===== Cost Calculator =====
function calculateCost() {
  const people = parseInt(document.getElementById('people')?.value) || 0;
  const days = parseInt(document.getElementById('days')?.value) || 0;
  const daily = parseInt(document.getElementById('daily')?.value) || 0;
  const total = people * days * daily;
  const resultElem = document.getElementById('cost-result');
  if(resultElem) {
    resultElem.innerText = `Estimated Total Cost: ₱${total.toLocaleString()}`;
  }
}

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== Mobile Navigation Toggle =====
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // ===== Booking Form Functionality =====
  const form = document.getElementById('booking-form');
  const packageSelect = document.getElementById('selectedPackage');
  const priceDisplay = document.getElementById('priceDisplay');
  const guestInput = document.querySelector('input[name="guests"]');
  const packageDescription = document.getElementById('packageDescription');
  const popup = document.getElementById('thankyou-popup');
  const closeBtn = document.getElementById('close-popup');

  const descriptions = {
    "Cloud 9 Surfing": "Ride the world-famous waves of Cloud 9. Includes surfboard rental and lessons.",
    "Island Hopping": "Explore Naked Island, Daku Island, and Guyam Island. Includes boat transfers and snorkeling gear.",
    "Sugba Lagoon": "Kayak and swim in crystal-clear waters at Sugba Lagoon. Includes kayak rental and guided tours."
  };

  // Helper function to parse URL query parameters
  function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    });
    return params;
  }

  // Load selected package and price from URL query parameters
  const params = getQueryParams();
  const packageNameFromUrl = params.package || null;
  const priceFromUrl = params.price || null;

  if (packageSelect) {
    if (packageNameFromUrl) {
      // Select option matching packageNameFromUrl
      for (let option of packageSelect.options) {
        if (option.text === packageNameFromUrl) {
          option.selected = true;
          // Override data-price attribute if priceFromUrl present
          if (priceFromUrl) {
            option.setAttribute('data-price', priceFromUrl);
          }
          break;
        }
      }
    } else {
      // fallback: load from localStorage if URL param not present
      const savedPackage = localStorage.getItem("selectedPackage");
      if (savedPackage) {
        for (let option of packageSelect.options) {
          if (option.text === savedPackage) {
            option.selected = true;
            break;
          }
        }
        localStorage.removeItem("selectedPackage");
      }
    }
  }

  function updatePackageDetails() {
    if (packageSelect && priceDisplay && guestInput && packageDescription) {
      const selectedOption = packageSelect.options[packageSelect.selectedIndex];
      const basePrice = parseInt(selectedOption.getAttribute('data-price')) || 0;
      const guests = parseInt(guestInput.value) || 1;
      const total = basePrice * guests;
      const packageName = selectedOption.text;

      priceDisplay.textContent = `Total Price: ₱${total.toLocaleString()}`;
      packageDescription.textContent = descriptions[packageName] || "Please select a package to see what's included.";
    }
  }

  if (packageSelect && priceDisplay && guestInput) {
    packageSelect.addEventListener("change", updatePackageDetails);
    guestInput.addEventListener("input", updatePackageDetails);
  }

  updatePackageDetails();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullname = form.querySelector('input[name="fullname"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const contact = form.querySelector('input[name="contact"]').value.trim();
      const guests = parseInt(form.querySelector('input[name="guests"]').value.trim());
      const date = form.querySelector('input[name="date"]').value;
      const selectedPackage = packageSelect?.options[packageSelect.selectedIndex]?.text || '';
      const notes = form.querySelector('textarea[name="notes"]')?.value.trim() || '';

      const newBooking = {
        fullname,
        email,
        contact,
        guests,
        date,
        package: selectedPackage,
        notes,
        timestamp: Date.now()
      };

      const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
      bookings.push(newBooking);
      localStorage.setItem("bookings", JSON.stringify(bookings));

      popup?.classList.remove('hidden');

      form.reset();
      updatePackageDetails();
    });

    closeBtn?.addEventListener('click', () => {
      popup.classList.add('hidden');
    });

    popup?.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.classList.add('hidden');
      }
    });
  }

  // ===== Travel Package "Book Now" Buttons =====
  document.querySelectorAll(".package .btn").forEach(button => {
    button.addEventListener("click", () => {
      const packageName = button.parentElement.querySelector("h3").textContent;
      localStorage.setItem("selectedPackage", packageName);
      window.location.href = "booking.html";
    });
  });

  // ===== Visitor Reviews: Star Rating Click =====
  document.querySelectorAll('#star-rating span').forEach(star => {
    star.addEventListener('click', function () {
      const value = this.getAttribute('data-value');
      document.getElementById('rating').value = value;

      document.querySelectorAll('#star-rating span').forEach(s => s.classList.remove('selected'));
      for (let i = 0; i < value; i++) {
        document.querySelectorAll('#star-rating span')[i].classList.add('selected');
      }
    });
  });

  // ===== Visitor Reviews: Submit Review and Display =====
  const reviewForm = document.getElementById('reviewForm');
  const userReviews = document.getElementById('userReviews');

  reviewForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const location = document.getElementById('location').value.trim();
    const message = document.getElementById('message').value.trim();
    const rating = document.getElementById('rating').value;
    const imageInput = document.getElementById('imageUpload');
    const imageFile = imageInput.files[0];

    if (!name || !location || !message || !rating) {
      alert('Please fill in all fields and select a rating.');
      return;
    }

    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const reviewDiv = document.createElement('div');
    reviewDiv.classList.add('review');

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        reviewDiv.innerHTML = `
          <p>${stars}</p>
          <img src="${event.target.result}" alt="User Image" width="100" />
          <p>${message}</p>
          <p><strong>${name}</strong>, ${location}</p>
        `;
        userReviews.prepend(reviewDiv);
      };
      reader.readAsDataURL(imageFile);
    } else {
      reviewDiv.innerHTML = `
        <p>${stars}</p>
        <p>${message}</p>
        <p><strong>${name}</strong>, ${location}</p>
      `;
      userReviews.prepend(reviewDiv);
    }

    reviewForm.reset();
  });

});
