
let isVisible = true;
document.querySelector("#hemburder-menu").addEventListener("click", () => {
  if(isVisible) {
    document.querySelector("#mobile-navbar").style.left = "0";
  } else {
    document.querySelector("#mobile-navbar").style.left = "-200px";
  }
  isVisible = !isVisible;
})


// Js Code to toggle between login and signup screen

const loginForm = document.querySelector(".login-display-c");
const signupForm = document.querySelector(".signup-display-c");
const loginLink = document.querySelector("#login-link");
const signupLink = document.querySelector("#signup-link");
const linkToLogin = document.querySelector(".login-link");
const linkToSignup = document.querySelector(".signup-link");

const displayScreen = (req) => {
  if (req === "login") {
    loginForm.style.display="block";
    signupForm.style.display="none";
    loginLink.classList.add("active");
    signupLink.classList.remove("active");
  } else if(req === "signup") {
    loginForm.style.display="none";
    signupForm.style.display="block";
    loginLink.classList.remove("active");
    signupLink.classList.add("active");
  }
}

if (loginLink) {
loginLink.addEventListener("click", () => {
  displayScreen("login");
})
}

if(signupLink) {
signupLink.addEventListener("click", () => {
  displayScreen("signup");
})
}

if(linkToLogin) {
linkToLogin.addEventListener("click", () => {
  displayScreen("login");
})
}

if(linkToSignup){
linkToSignup.addEventListener("click", () => {
  displayScreen("signup");
})
}

// FAQ section Js to show and hide answer of a question

function toggleResponce(value) {
  let elementId = value.slice(-1);
  const upArrow =document.querySelector(`#up-arrow-${elementId}`);
  const downArrow = document.querySelector(`#down-arrow-${elementId}`);
  const questionPara =document.querySelector(`#faq-q-${elementId}`);
  const answerPara =document.querySelector(`#faq-a-${elementId}`);
  const highlightValue = questionPara.classList.contains('highlight');
  if (highlightValue == false) {
    questionPara.classList.add('highlight');
    answerPara.classList.remove('hide');
    downArrow.style.display = 'none';
    upArrow.style.display ='block';
  } else {
    questionPara.classList.remove('highlight');
    answerPara.classList.add('hide');
    downArrow.style.display='block';
    upArrow.style.display='none';
  }
}

// javascript code to send form data to server


//Javascript code that respose to product card click and open detail productshowcase page

document.querySelectorAll('.product-card-c').forEach((div) => {
  div.addEventListener('click', function(event) {
    // console.log(event.target.closest('.product-card-c').id);
    const selectedId =event.target.closest('.product-card-c').id;
    window.location.assign(`http://localhost:3000/products/${selectedId}`);
  });
});