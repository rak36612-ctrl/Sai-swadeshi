$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
      loop: true,
      margin: 10,
      nav: false,
      autoplay: true,
      autoplayTimeout: 3000,
      items: 1
    } });
 } });

  // Quick service

  //prevent non numeric input  in the phone number field
  // document.getElementById("phone").addEventListener("input", function(e){
  //   var phoneInput = e.target;
  //   phoneInput.value = phoneInput.value.replace(/[^0-9]/g, ''); //Replce non-numeric characters
  // } });
  
  // document.getElementById("quickServiceForm").addEventListener("submit",function(event){
  //   var phoneInput = document.getElementById("phone");
  //   var phoneError = document.getElementById("phoneError");
  //   var phonePattern = /^[0-9]{10}$/;

    //Reset Error message
    // phoneError.style.display = "none";

    //validate phone number
  //   if(!phonePattern.test(phoneInput.value)){
  //     event.preventDefault();//prevent from submission
  //     phoneError.style.display ="block";//show error message
  //   }
  // } });

  // google rating
 // Define the common URL for all buttons
const commonLink = 'https://g.co/kgs/WZG2cK';

// Select all buttons with the class "redirect-button"
const buttons = document.querySelectorAll('.redirect-button');

// Add the event listener to each button
buttons.forEach(button => {
    button.addEventListener('click', function () {
        window.open(commonLink, '_blank'); // Open the common link in a new tab
    } });
} });
// Review
// document.addEventListener('DOMContentLoaded', function () {
//   const swiper = new Swiper('.swiper-container', {
//       slidesPerView: 1,
//       spaceBetween: 20,
//       loop: true,
//       pagination: {
//           el: '.swiper-pagination',
//           clickable: true,
//       },
//       autoplay: {
//           delay: 3000,
//           disableOnInteraction: false,
//       },
//   } });
// } });

// const swiper = new Swiper('.swiper-container', {
//   loop: true, // Enable infinite loop
//   autoplay: {
//       delay: 5000, // Auto-slide every 3 seconds
//       disableOnInteraction: false, // Keep autoplay running
//   },
//   pagination: {
//       el: '.swiper-pagination',
//       clickable: true,
//   },
// } });

document.addEventListener('DOMContentLoaded', function () {
  // Get form and input elements
  const form = document.getElementById('quoteForm');
  const fullNameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const serviceDescriptionInput = document.getElementById('serviceDescription');
  const messageInput = document.getElementById('message');

  // Ensure that the form and inputs exist before adding listeners
  if (form && fullNameInput && phoneInput && emailInput && serviceDescriptionInput && messageInput) {
      form.addEventListener('submit', async function (e) {
          e.preventDefault(); // Prevent the default form submission

          console.log('form submitted');
          // Collect form data
          const formData = {
              name: fullNameInput.value,
              phone: phoneInput.value,
              email: emailInput.value,
              serviceDescription: serviceDescriptionInput.value,
              message: messageInput.value
          };

          try {
              const response = await fetch('https://saiswadeshi.in/api/registration', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(formData) // Send the data as JSON
              } });

              const data = await response.json();

              if (response.ok) {
                  alert('Registration Successful!');
                  // Optionally reset form or perform additional actions
                  form.reset();
              } else {
                  alert('Error: ' + data.message); // Display error message if any
              }
          } catch (error) {
              console.error('Error:', error);
              alert('There was an error submitting the form');
          }
      } });
  } else {
      console.error('Form or input elements not found!');
  }
} });


// Function to toggle the arrow direction on collapse show/hide
function toggleArrow(arrowId) {
    const arrow = document.getElementById(arrowId);
    const contentId = arrowId.replace('-arrow', '-content');
    const content = document.getElementById(contentId);
  
    // Toggle arrow direction
    arrow.classList.toggle("up");
  
    // Toggle content visibility
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
}
  
document.addEventListener("DOMContentLoaded", () => {
    const navCollapse = document.querySelector(".navbar-collapse");
    const navToggler = document.querySelector(".navbar-toggler");

    navToggler.addEventListener("click", () => {
        setTimeout(() => {
            if (navCollapse.classList.contains("show")) {
                navCollapse.style.height = "auto";
            } else {
                navCollapse.style.height = "0";
            }
        }, 200); // Adjust delay if needed
    } });
} });

//contact

const contactFormEl = document.getElementById("contactForm");
if (contactFormEl) {
    contactFormEl.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        const recaptchaResponse = grecaptcha.getResponse(); // Get reCAPTCHA response

        if (!recaptchaResponse) {
            alert("Please complete the reCAPTCHA.");
            return;
        }

        const formData = { name, phone, email, message, recaptchaResponse };

        try {
            const response = await fetch("https://saiswadeshi.in/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Message sent successfully!");
                contactFormEl.reset(); // Clear form after submission
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send message.");
        }
    });
}

