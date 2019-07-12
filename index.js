const config = {
  apiKey: "AIzaSyAH4qlRtWu11ZygX5Rh33YNmGlZoWiIH10",
  authDomain: "users-af0b6.firebaseapp.com",
  databaseURL: "https://users-af0b6.firebaseio.com",
  projectId: "users-af0b6",
  storageBucket: "users-af0b6.appspot.com",
  messagingSenderId: "93253330064",
  appId: "1:93253330064:web:831e1df57b957e39"
};

if( window.location === "index2.html" && localStorage.getItem("login") ){
  window.location = "index2.html"
}

firebase.initializeApp(config);
let database = firebase.database();
const userListUI = document.getElementById("userList");
const errorList = document.getElementById("errorLog");
const users = new Set([]);
const authData = {};
const authDataReg = {};

database.ref().child('users').once("value").then(function (snap) {
  snap.forEach(function (snapshot) {
    if (snapshot.val().login) {
      users.add(snapshot.val().login)
    }
  });
})

function load() {
  let login = document.getElementById("login").value.toLowerCase();
  let password = document.getElementById("password").value.toLowerCase();
  database.ref().child('users/' + login).on("value", snap => {
    authDataReg.password = snap.val().password
  })
  if (login) {
      database.ref().child('users').on("child_added", snap => {
      users.add(snap.val().login)
    })
  }
  if (login != "" && password != "" && !users.has(login)) {
    localStorage.setItem("login", login)
   database.ref('users/' + login.toLowerCase()).set({
      password: password,
      login: login
    });
    errorList.innerHTML = "Регистрация прошла успешно, выполняется вход"
    setTimeout(()=>{
    window.location = "index2.html"
  },500)
}
  else if (login === "" || password === "") {
    errorList.innerHTML = "Пожалуйста, заполните поля"
  }
  else {
    (errorList.innerHTML != "") ? errorList.innerHTML = "" : errorList.innerHTML = "Пользователь с таким логином уже существует"
  }
}


function signIn() {
  let login = document.getElementById("login").value.toLowerCase();
  let password = document.getElementById("password").value.toLowerCase();
  database.ref().child('users/' + login).on("value", snap => {
    authData.password = snap.val().password
    authData.login = snap.val().login
  })

  setTimeout(() => {
    if (authData.password === password) {
      localStorage.setItem("login", authData.login)
      window.location = "index2.html"
    }
    else {
      errorList.innerHTML = "Проверьте написание введенных данных"
    }
  }, 300)

}

function showList() {
  if (document.querySelector("ul").lastElementChild) {
    () => {
      let ul = document.querySelector("ul");
      var child = ul.lastElementChild;
      while (child) {
        ul.removeChild(child);
        child = ul.lastElementChild;
      }
    }
  }
  else {
    database.ref().child('users').once("value").then(function (snap) {
      snap.forEach(function (snapshot) {
        let $li = document.createElement("li");
        $li.innerHTML = snapshot.val().login;
        userListUI.append($li);
      });
    })
  }
}

function logOut() {
  window.location = "index.html"
  localStorage.removeItem("login")
}

function changeType()
{
  let input = document.getElementById("password").type
  if (input === "password")
  {
    document.getElementById("password").type = "text"
  }
  else if (input === "text"){
    document.getElementById("password").type = "password"
  }
}