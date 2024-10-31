// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, collection, getDocs, addDoc, setDoc, getDoc, getFirestore, deleteDoc } from "firebase/firestore";

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
retrieveExistingButton.addEventListener("click", loadExistingPicture);


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
        startPicture(gridSize);
    });
}

function startExistingPicture(doc) {
    showPictureScreen();
    let sizeGrid = doc.data().gridSize;
    let gridData = doc.data().grid;

    // Set grid size
    document.querySelector(".container").style.gridTemplateColumns = `repeat(${sizeGrid}, 1fr)`;
    document.querySelector(".drawingElements").style.gridTemplateColumns = `repeat(${sizeGrid}, 1fr)`;

    let numBoxesCreated = '';

    // Create grid from save
    let boxCount = 0;
    for(let i = 0; i < sizeGrid; i++) {
        for(let j = 0; j < sizeGrid; j++) {

            if (gridData[boxCount].type == "arrow") {
                numBoxesCreated += `<div class="col" draggable="false" id="${"box" + boxCount}"><img src="./src/arrow.jpg" alt="arrowImage" draggable="false" class="arrow"></img></div>`;
            }
            else if (gridData[boxCount].type == "textbox") {
                numBoxesCreated += `<div class="col" draggable="false" id="${"box" + boxCount}"><textarea class="textBox" rows="1" draggable="false" readonly="true">${gridData[boxCount].text}</textarea></div>`;
            }
            else {
                numBoxesCreated += `<div class="col" draggable="false" id="${"box" + boxCount}"></div>`;
            }

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
        box.addEventListener("dblclick", () => edit(box));
    })

    // Add event listener to drawing elements
    document.getElementById("arrow").addEventListener("dragstart", drag);
    document.getElementById("textBox").addEventListener("dragstart", drag);
    document.getElementById("deleteElement").addEventListener("dragover", allowDrop);
    document.getElementById("deleteElement").addEventListener("drop", deleteDrop);

    // Overwrite save
    document.getElementById("saveName").value = doc.id;
    document.getElementById("saveName").style.display = "none";

    // Save button event listener
    const savePictureButton = document.getElementById("savePicture");
    savePictureButton.addEventListener("click", () => savePictureGrid(sizeGrid));
    
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
            numBoxesCreated += `<div class="col" draggable="false" id="${"box" + boxCount}"></div>`;
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
        box.addEventListener("dblclick", () => edit(box));
    })

    // Add event listener to drawing elements
    document.getElementById("arrow").addEventListener("dragstart", drag);
    document.getElementById("textBox").addEventListener("dragstart", drag);
    document.getElementById("deleteElement").addEventListener("dragover", allowDrop);
    document.getElementById("deleteElement").addEventListener("drop", deleteDrop);

    // Clear save name text
    document.getElementById("saveName").value = "";
    document.getElementById("saveName").style.display = "block";

    // Save button event listener
    const savePictureButton = document.getElementById("savePicture");
    savePictureButton.addEventListener("click", () => savePictureGrid(sizeGrid));
}

///// Drag and Drop Functionality /////
let startBox = null;
let selectedBox = null;

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

// Edit a box when double clicked
function edit(box) {

    if (selectedBox != null) {
        selectedBox.style.border = "1px dotted black";
        selectedBox.setAttribute("draggable", false);
        if (selectedBox.firstChild != null) {
            if (selectedBox.firstChild.className == "textBox") {
                selectedBox.firstChild.setAttribute("readonly", true);
            }
        }
    }

    selectedBox = box;
    selectedBox.style.border = "2px solid yellow";
    selectedBox.setAttribute("draggable", true);
    if (selectedBox.firstChild != null) {
        if (selectedBox.firstChild.className == "arrow") {
            console.log("EDITING: arrow");
        }
        else {
            // When editing a textbox allow editing text
            console.log("EDITING: textBox");
            selectedBox.firstChild.removeAttribute("readonly");
        }
    }
    else {
        console.log("EDITING: empty box");
    }
}

// Delete Element
function deleteDrop(ev) {
    ev.preventDefault();

    // Makes sure drawing elements cannot be deleted
    if (startBox.innerHTML !== "" & startBox.id != "arrow" & startBox.id != "textBox") {
        startBox.innerHTML = "";
    }
    
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    startBox = ev.target;
    console.log("DRAG:", ev.target);
}

// Add Arrow
function addArrow(finalBox) {
    finalBox.innerHTML = `<img src="./src/arrow.jpg" alt="arrowImage" draggable="false" class="arrow"></img>`;
}

// Add text box
function addTextBox(finalBox) {
    finalBox.innerHTML = `<textarea class="textBox" rows="1" readonly></textarea>`;
}

///// Rotate Functionality /////



///// Save and Retrieve Functionality ///// 

// Load existing game
async function loadExistingPicture() {
    const drawingSaves = await getDocs(collection(db, "drawingSaves"));

    // Display list of existing saves
    const tableBody = document.getElementById("listSaves").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";
    drawingSaves.forEach((doc) => {
        const row = document.createElement("tr");
        const id = document.createElement("td");
        const button = document.createElement("td");
        const deleteButton = document.createElement("td");

        id.innerHTML = doc.id;
        button.className = "playButton";
        deleteButton.className = "deleteButton";

        // Button listeners
        const playButton = document.createElement("button");
        playButton.id = `${doc.id}button`;
        playButton.innerHTML = "Play";
        playButton.addEventListener("click", () => startExistingPicture(doc));

        const deleteButtonListener = document.createElement("button");
        deleteButtonListener.innerHTML ="Delete";
        deleteButtonListener.addEventListener("click", () => deletePictureGrid(doc));

        button.appendChild(playButton);
        deleteButton.appendChild(deleteButtonListener);
        row.appendChild(id);
        row.appendChild(button);
        row.appendChild(deleteButton);

        tableBody.appendChild(row);
    });

    showSaveScreen();
}

// Add a save to firestore db
function savePictureGrid(sizeGrid) {

    // Retrieve and save current grid data
    const boxElements = document.querySelectorAll('.col');
    let jsonData = {
        gridSize: sizeGrid,
        grid: []
    };

    // Add data from each box into json
    boxElements.forEach(box => {
       
        if(box.firstChild == null) {
            jsonData.grid.push({type: null});
        }
        else if (box.firstChild.className == "arrow") {
            jsonData.grid.push({type: "arrow"});
        }
        else {
            jsonData.grid.push({type: "textbox", text: box.firstChild.value});
        }
    })

    const saveName = document.getElementById("saveName").value;
    const docRef = doc(db, "drawingSaves", saveName);

    // Add to firestore
    setDoc(docRef, jsonData)
    .then(() => {
      console.log("Document written");
    })
    .catch((e) => {
      console.error("Error writing document");
    })

    showEntryScreen();
}

// Delete a save from firestore db 
async function deletePictureGrid(document) {
    await deleteDoc(doc(db, "drawingSaves", document.id));
    location.reload();
    console.log("Document deleted");
}
