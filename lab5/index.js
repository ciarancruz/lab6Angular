// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDoc, getFirestore } from "firebase/firestore";
import { doc, collection, getDocs, addDoc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// import ready-made UI
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDR_yQg5xcwIi2pCyvqhcg_JCvtC9CNuw",
  authDomain: "lab5baasproject.firebaseapp.com",
  projectId: "lab5baasproject",
  storageBucket: "lab5baasproject.appspot.com",
  messagingSenderId: "628226166238",
  appId: "1:628226166238:web:a31abe2df8efef7d4c214f",
  measurementId: "G-X6EDDSFCD1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get reference to database
const db = getFirestore(app);

// Add user
function displayAddUser() {
    document.getElementById("listPeople").style.display = "none";
    document.getElementById("addUserScreen").style.display = "flex";
    document.getElementById('idInput').value = "";
    document.getElementById('nameInput').value = "";
}

function addUser() {
  const id = document.getElementById('idInput').value;
  const name = document.getElementById('nameInput').value;
  const data = {
    name: name
  }

  const docRef = doc(db, "users", id);
  setDoc(docRef, data)
    .then(() => {
      console.log("Document written");
    })
    .catch((e) => {
      console.error("Error writing document");
    })

    document.getElementById("addUserScreen").style.display = "none";
}

const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener("click", addUser)
const addUserButton = document.querySelector("#addUser");
addUserButton.addEventListener("click", displayAddUser);

const signOutButton = document.querySelector("#signOutUser");
signOutButton.addEventListener("click", signOutUser);
const viewUsersButton = document.querySelector("#viewUsers");
viewUsersButton.addEventListener("click", displayUsers);

// Authentication
const uiConfig = {
  signInSuccessUrl: "index.html",
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID, 
      requireDisplayName: false
    }
  ]
};

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  // code here that fetches the dom object for the element where you want to insert the ready-made UI (here it is called authEl)
  let authEl = document.getElementById("firebaseui-auth-container");
  if (auth.currentUser) {
      // a user is logged in - remove the contents of authEl
      authEl.innerHTML = "";
      authEl.style.display = "none";
      document.getElementById("addUser").style.display = "block";
      document.getElementById("signOutUser").style.display = "block";
      document.getElementById("viewUsers").style.display = "block";

  } else {
// here prepare page content you want to be visible during log in
      // ...
      // the following two lines create the ready-made UI
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start(authEl, uiConfig);
  }
});

function signOutUser() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("User signed out successfully")
      document.getElementById("addUser").style.display = "none";
      document.getElementById("signOutUser").style.display = "none";
      document.getElementById("viewUsers").style.display = "none";

      document.getElementById("listPeople").innerHTML = "";

      let authEl = document.getElementById("firebaseui-auth-container");
      authEl.style.display = "block";
    })
    .catch((error) => {
      console.log("Error occurred")
    })
}

// TODO Function to display users
async function displayUsers() {
  document.getElementById("addUserScreen").style.display = "none";
  document.getElementById("listPeople").style.display = "inline-block";

  const querySnapshot = await getDocs(collection(db, "users"));
  let tableString = "";

  querySnapshot.forEach((doc) => {
    tableString += `<tr>
                        <td>${doc.id}</td>
                        <td>${doc.data().name}</td>
                    </tr>`
  });

  document.getElementById("listPeople").getElementsByTagName('tbody')[0].innerHTML = tableString;
  document.getElementById("listPeople").getElementsByTagName('thead')[0].innerHTML = `<tr>
                                                                                  <th>ID</th>
                                                                                  <th>Name</th>
                                                                              </tr>`
}
  