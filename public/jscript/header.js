
let isVisible = true;
document.querySelector("#hemburder-menu").addEventListener("click", () => {
  if (isVisible) {
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
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    loginLink.classList.add("active");
    signupLink.classList.remove("active");
  } else if (req === "signup") {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    loginLink.classList.remove("active");
    signupLink.classList.add("active");
  }
}

if (loginLink) {
  loginLink.addEventListener("click", () => {
    displayScreen("login");
  })
}

if (signupLink) {
  signupLink.addEventListener("click", () => {
    displayScreen("signup");
  })
}

if (linkToLogin) {
  linkToLogin.addEventListener("click", () => {
    displayScreen("login");
  })
}

if (linkToSignup) {
  linkToSignup.addEventListener("click", () => {
    displayScreen("signup");
  })
}

// FAQ section Js to show and hide answer of a question

function toggleResponce(value) {
  let elementId = value.slice(-1);
  const upArrow = document.querySelector(`#up-arrow-${elementId}`);
  const downArrow = document.querySelector(`#down-arrow-${elementId}`);
  const questionPara = document.querySelector(`#faq-q-${elementId}`);
  const answerPara = document.querySelector(`#faq-a-${elementId}`);
  const highlightValue = questionPara.classList.contains('highlight');
  if (highlightValue == false) {
    questionPara.classList.add('highlight');
    answerPara.classList.remove('hide');
    downArrow.style.display = 'none';
    upArrow.style.display = 'block';
  } else {
    questionPara.classList.remove('highlight');
    answerPara.classList.add('hide');
    downArrow.style.display = 'block';
    upArrow.style.display = 'none';
  }
}

// javascript code to send form data to server


//Javascript code that respose to product card click and open detail productshowcase page

document.querySelectorAll('.product-card-c').forEach((div) => {
  div.addEventListener('click', function (event) {
    const selectedId = event.target.closest('.product-card-c').id;
    window.location.assign(`http://localhost:3000/products/${selectedId}`);
  });
});

//Javascript code that respose to job apply button click and open job apply page

const jobForm = document.querySelector(".job-application-block");
const jobDisplay = document.querySelector(".career-page-main-c");

function apply(jobId) {
  // console.log(jobId);
  const position = document.querySelector(`#p-${jobId}`);
  console.log("'"+position.textContent+"'");
  document.querySelector('#position').value=position.textContent.trim();
  jobForm.style.display = "block";
  jobDisplay.style.display = "none";
}

let crossIcon = document.querySelector('#job-form-cross')
if(crossIcon) {
crossIcon.addEventListener('click', () => {
  jobForm.style.display = "none";
  jobDisplay.style.display = "block";
})
}

// Javascript code to validate job application form

let applicantNameFlag = false;
let applicantEmailFlag = false;
let applicantPhoneFlag = false;
let applicantResumeFlag = false;
let applicantName = document.querySelector('#name');
let applicantEmail = document.querySelector('#email');
let applicantPhone = document.querySelector('#phone');
let applicantResume = document.querySelector('#cv');
let applicantionSubmitBtn = document.querySelector('.job-form-submit-btn');

if(applicantName){
  applicantName.addEventListener('blur', () => {
    let regName = /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/;
    let nameValue = applicantName.value;
    if (!regName.test(nameValue)) {
      applicantName.classList.add("error-msg");
      applicantNameFlag = false;
    } else {
      applicantName.classList.remove("error-msg");
      applicantNameFlag = true;
    }
  })
  }

  if(applicantEmail){
    applicantEmail.addEventListener('blur', () => {
      let regName = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      let emailValue = applicantEmail.value;
      if (!regName.test(emailValue)) {
        applicantEmail.classList.add("error-msg");
        applicantEmailFlag = false;
      } else {
        applicantEmail.classList.remove("error-msg");
        applicantEmailFlag = true;
      }
    })
    }

    if(applicantPhone){
      applicantPhone.addEventListener('blur', () => {
        let regName = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        let phoneValue = applicantPhone.value;
        if (!regName.test(phoneValue)) {
          applicantPhone.classList.add("error-msg");
          applicantPhoneFlag = false;
        } else {
          applicantPhone.classList.remove("error-msg");
          applicantPhoneFlag = true;
        }
      })
      }

      function fileValidation(){
        let selectedFile = document.querySelector('#cv').files[0];
        console.log(selectedFile.size);
        let ValidFileType = "application/pdf";
        if(ValidFileType !== selectedFile.type || selectedFile.size>1048576) {
          alert('Only PDF fileformat is accepted under 1MB size');
          document.querySelector('#cv').value='';
          applicantResumeFlag = false;
        }
        applicantResumeFlag=true;
      }

      async function applicationSubmit() {
        const form = document.querySelector('.job-application-form')
        if (applicantNameFlag && applicantEmailFlag && applicantPhoneFlag && applicantResumeFlag) {
          try {
            const formData = new FormData(form);
            const response = await fetch('/apply', {
              method: 'POST',
              // headers: {
              //   'Content-Type': 'application/json'
              // },
              body: formData
            });
        
            const result = await response;
            const resMessage = await response.text();
            
            if(result.ok){
              displayMessage(resMessage,true);
            } else {
              displayMessage(resMessage,false);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        } else {
          alert('Some input value is not valid or filled properly')
        }
      };

      function displayMessage(message, state) {
        const messageDiv = document.querySelector('.res-msg-c');
        const resIcon = document.querySelector('#job-res-msg');
        const resMsg = document.querySelector('.res-msg');
        if(state){
          messageDiv.style.top='200px';
          resIcon.classList.add('fa-circle-check','green');
          resMsg.classList.add('green');
          resMsg.textContent=message;
        } else {
          messageDiv.style.display="block";
          resIcon.classList.add('fa-circle-xmark','red');
          resMsg.classList.add('red');
          resMsg.textContent=message;
        }
        setTimeout(() => {
          messageDiv.style.top='-200px';
          window.location.assign(`http://localhost:3000/career`);
        }, 3000);
    }


// JAvascript code to put tray small image to main large screen in product description page (productshowcase.ejs)

const mainImage = document.querySelector(".pd-main-img");
const subImages = document.querySelectorAll(".pd-sub-img");

for (let i = 0; i < subImages.length; i++) {
  subImages[i].addEventListener('click', () => {
    const pickedUrl = subImages[i].getAttribute('src');
    mainImage.src = pickedUrl;
  })
}

// Javascript code for register form validatio

let userNameFlag = false;
let emailFlag = false;
let passwordOneFlag = false;
let passwordTwoFlag = false;
let userName = document.getElementById('user-name');
let userEmail = document.getElementById('user-email');
let passwordOne = document.getElementById('signup-password');
let passwordTwo = document.getElementById('signup-repassword');
let signupBtn = document.querySelector('#signup-form-submit-btn');

if(userName){
userName.addEventListener('blur', () => {
  let regName = /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/;
  let nameValue = userName.value;
  if (!regName.test(nameValue)) {
    userName.classList.add("error-msg");
    userNameFlag = false;
  } else {
    userName.classList.remove("error-msg");
    userNameFlag = true;
    activate();
  }
})
}

if(userEmail){
userEmail.addEventListener('blur', () => {
  let regName = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let emailValue = userEmail.value;
  if (!regName.test(emailValue)) {
    userEmail.classList.add("error-msg");
    emailFlag = false;
  } else {
    userEmail.classList.remove("error-msg");
    emailFlag = true;
    activate();
  }
})
}

if(passwordOne){
passwordOne.addEventListener('blur', () => {
  let regName = /^\S+$/;
  let passwordOneValue = passwordOne.value;
  if (!regName.test(passwordOneValue)) {
    passwordOne.classList.add("error-msg");
    passwordOneFlag = false;
  } else {
    passwordOne.classList.remove("error-msg");
    passwordOneFlag = true;
    activate();
  }
})
}

if(passwordTwo){
passwordTwo.addEventListener('blur', () => {
  let passwordTwoValue = passwordTwo.value;
  if (passwordOne.value !== passwordTwoValue) {
    passwordTwo.classList.add("error-msg");
    passwordTwoFlag = false;
  } else {
    passwordTwo.classList.remove("error-msg");
    passwordTwoFlag = true;
    activate();
  }
})
}

function activate() {
  if (userNameFlag && emailFlag && passwordOneFlag && passwordTwoFlag) {
    document.getElementById('signup-form-submit-btn').disabled = false;
  } 
};

if(signupBtn){
signupBtn.addEventListener('click', () => {
  if(!userNameFlag || !emailFlag || !passwordOneFlag || !passwordTwoFlag) {
    const errorMsg = document.createElement('p');
    errorMsg.classList.add("error-msg");
    errorMsg.innerHTML = 'Some form input is not valid, try again';
    const formContainer = document.querySelector('.signup-form');
    const lastDiv = document.querySelector('#rg-password2-c');
    // const signupBtn = document.querySelector('#signup-form-submit-btn');
    formContainer.insertBefore(errorMsg, lastDiv.nextSibling);
    setTimeout(() => {
      errorMsg.remove();
    }, 1500);
  }
})
}

// javascript function to check the status of checkbox and perform action according to status of checkbox

function filterList(){
  let brandDiv = document.querySelector('#brand-filter');
  let brandCheckboxs = brandDiv.querySelectorAll('input[type="checkbox"]');
  let categoryDiv = document.querySelector('#category-filter');
  let categoryCheckboxs = categoryDiv.querySelectorAll('input[type="checkbox"]');
  let priceDiv = document.querySelector('#price-filter');
  let priceCheckboxs = priceDiv.querySelectorAll('input[type="checkbox"]');
  let brandArray=[];
  let categoryArray=[];
  let priceArray=[];
  brandArray=[];
  categoryArray=[];
  priceArray=[];
  brandCheckboxs.forEach((checkbox) =>{
    if(checkbox.checked){
      brandArray.push(checkbox.value);
    }
  })
  categoryCheckboxs.forEach((checkbox) => {
    if(checkbox.checked){
      categoryArray.push(checkbox.value);
    }
  })
  priceCheckboxs.forEach((checkbox) =>  {
    if(checkbox.checked){
      priceArray.push(checkbox.value);
    }
  })
  console.log(brandArray);

  fetchFilteredContent(brandArray);
}

async function fetchFilteredContent(condition){
  try {
    const response = await fetch('/products/filter', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(condition)
    });

    // const result = await response.json();
    // console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Javascript code for login functionality

// function loginAction() {
//   const form = document.querySelector('.login-form');
// const email = form.elements.loginId.value;
// const password = form.elements.password.value;
//   // let loginId = document.querySelector('#login-id').value;
//   // let password = document.querySelector('#login-password').value;
//   alert(email);
//   alert(password);
//   fetch("/login",{
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ loginId: email, password:password})
//   })
//   .then(response => console.log(response.json()))
// .then(data => {
//   // Handle the response data here
//   console.log(data.message);
// })
// .catch(error => {
//   // Handle errors here
//   console.error(error);
// });
// }

// const form = document.querySelector('.login-form');
//       form.addEventListener('submit', async (event) => {
//         event.preventDefault();
//         const name = form.elements.loginId.value;
//         const email = form.elements.password.value;
//         const data = { name, email };
//         console.log(data);
//         const response = await fetch("/login", {
//           method: 'POST',
//           // headers: {
//           //   'Content-Type': 'application/json'
//           // },
//           body:  data //JSON.stringify(data)
//         });
//         const result = await response.json();
//         console.log(result);
//       })