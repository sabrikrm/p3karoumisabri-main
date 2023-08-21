// LOGIN
const loginUrl = "http://localhost:5678/api/users/login";
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const submitBtn = document.querySelector("input[type='submit']");
const form = document.getElementById("loginForm");
const loginError = document.querySelector(".loginError");
const passwordError = document.querySelector(".passwordError");

const logUser = {
  email: "",
  password: "",
};

// 
//LOGIQUE contrôle du Log IN

// Evenement au Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  loginUser();
});

// Evenement au MAIL
inputEmail.addEventListener("input", (e) => {
  inputEmail.reportValidity();
  logUser.email = e.target.value;
});

// Evenement au Password
inputPassword.addEventListener("input", (e) => {
  inputPassword.reportValidity();
  logUser.password = e.target.value;
});

//Evenement au chargement du DOM
document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  logUser.email = inputEmail.value;
  logUser.password = inputPassword.value;
  console.log(logUser);
});

// *********************************
// Fetch la route user

async function loginUser() {
  try {
    await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logUser),
    })
      .then((response) => response.json())
      .then((responseData) => {
        data = responseData;
        console.log(data);
      });
    if (data.message) {
      loginError.textContent = "données de connexion incorrect";
   
      console.log(logUser);
    } else if (data.error) {
      passwordError.textContent = "données de connexion incorrect";
      loginError.textContent = "données de connexion incorrect";
   


      console.log(logUser);
    } else {
   
      passwordError.textContent = "";
      loginError.textContent = "";
      console.log("LogAdmin OK");
      console.log(logUser);
      // stockage du token dans le stockage local
      localStorage.setItem("token", data.token);
      //Redirection index.html
      window.location.href = "../index.html";
    }
  } catch (error) {
    console.log(error);
  }
}
