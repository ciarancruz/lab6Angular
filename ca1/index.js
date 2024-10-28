// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, collection, getDocs, addDoc, setDoc, getDoc, getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJVhSTIT-pUOuOpWkhsaN5dZ5mjh-AIoI",
  authDomain: "rwat-ca1.firebaseapp.com",
  projectId: "rwat-ca1",
  storageBucket: "rwat-ca1.appspot.com",
  messagingSenderId: "765014458593",
  appId: "1:765014458593:web:35733708a4e1de2506f7a0",
  measurementId: "G-PMBKE224GH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


///// Initialize buttons /////
const startNewButton = document.getElementById("startNewButton");
startNewButton.addEventListener("click", startNewPicture);
const retrieveExistingButton = document.getElementById("retrieveExistingButton");
retrieveExistingButton.addEventListener("click", loadExistingGame);


///// Show or hide screens /////
function showEntryScreen() {
    document.getElementById('entryScreen').style.display = "block";
    document.getElementById('specifySizeScreen').style.display = "none";
    document.getElementById('pictureScreen').style.display = "none";
    document.getElementById('existingSaveScreen').style.display = "none";
}

function showSpecifySizeScreen() {
    document.getElementById('specifySizeScreen').style.display = "block";
    document.getElementById('entryScreen').style.display = "none";
    document.getElementById('pictureScreen').style.display = "none";
    document.getElementById('existingSaveScreen').style.display = "none";
}

function showPictureScreen() {
    document.getElementById('pictureScreen').style.display = "block";
    document.getElementById('entryScreen').style.display = "none";
    document.getElementById('specifySizeScreen').style.display = "none";
    document.getElementById('existingSaveScreen').style.display = "none";
}

function showSaveScreen() {
    document.getElementById('existingSaveScreen').style.display = "block";
    document.getElementById('entryScreen').style.display = "none";
    document.getElementById('specifySizeScreen').style.display = "none";
    document.getElementById('pictureScreen').style.display = "none";
}

///// Initialize screens /////
function startNewPicture() {
    showSpecifySizeScreen();

    // Default to min
    document.getElementById('gridSize').value = 3;

    // Pick grid size
    const specifySizeSubmit = document.getElementById("specifySizeSubmit");
    specifySizeSubmit.addEventListener("click", function(e) {
        var gridSize = document.getElementById('gridSize').value;
        console.log("Grid Size:", gridSize);
        startPicture(gridSize);
    });
}

function startPicture(sizeGrid) {
    showPictureScreen();

    let numBoxesCreated = '';

    // Change grid size
    document.querySelector(".container").style.gridTemplateColumns = `repeat(${sizeGrid}, 1fr)`;
    document.querySelector(".drawingElements").style.gridTemplateColumns = `repeat(${sizeGrid}, 1fr)`;

    // Create grid
    let boxCount = 0;
    for(let i = 0; i < sizeGrid; i++) {
        for(let j = 0; j < sizeGrid; j++) {
            numBoxesCreated += `<div class="col" draggable="true" id="${"box" + boxCount}"></div>`;
            boxCount++;
        }
    }

    document.querySelector(".container").innerHTML = numBoxesCreated;

    // Add event listeners to each box
    const boxElements = document.querySelectorAll('.col');
    console.log(boxElements);
    boxElements.forEach(box => {
        box.addEventListener("dragstart", drag);
        box.addEventListener("dragover", allowDrop);
        box.addEventListener("drop", drop);
    })

    // Add event listener to drawing elements
    document.getElementById("arrow").addEventListener("dragstart", drag);
    document.getElementById("textBox").addEventListener("dragstart", drag);
}

///// Drag and Drop Functionality /////
let startBox = null;

function drop(ev) {
    ev.preventDefault();
    const finalBox = ev.target;
    console.log("Final:", ev.target);

    if(startBox.id === "arrow") {
        addArrow(finalBox);
    }
    else if (startBox.id === "textBox") {
        addTextBox(finalBox);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    startBox = ev.target;
    console.log("Start:", ev.target);
}

// Add Arrow
function addArrow(finalBox) {
    finalBox.innerHTML = `<img src="./src/arrow.jpg" alt="arrowImage" draggable="false"></img>`;
}

// Add text box
function addTextBox(finalBox) {
    finalBox.innerHTML = `<textarea></textarea>`;
}


///// Save and Retrieve Functionality ///// 

// Save button event listener
const savePictureButton = document.getElementById("savePicture");
savePictureButton.addEventListener("click", savePictureGrid);

// Load existing game
async function loadExistingGame() {
    const drawingSaves = await getDocs(collection(db, "drawingSaves"));

    // Display list of existing saves
    const tableBody = document.getElementById("listSaves").getElementsByTagName('tbody')[0];
    drawingSaves.forEach((doc) => {
        const row = document.createElement("tr");
        const id = document.createElement("td");
        const button = document.createElement("td");

        id.innerHTML = doc.id;

        const playButton = document.createElement("button");
        playButton.id = `${doc.id}button`;
        playButton.innerHTML = "Play";
        playButton.addEventListener("click", drag);

        button.appendChild(playButton);
        row.appendChild(id);
        row.appendChild(button);

        tableBody.appendChild(row);
    });

    showSaveScreen();
}

// Add a save to firestore db
function savePictureGrid() {
    
    // Save arrows


    showEntryScreen();


}
