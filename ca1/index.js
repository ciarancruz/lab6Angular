///// Initialize buttons /////
const startNewButton = document.getElementById("startNewButton");
startNewButton.addEventListener("click", startNewPicture);
const retrieveExistingButton = document.getElementById("retrieveExistingButton");
// retrieveExistingButton.addEventListener("click", );


///// Show or hide screens /////
function showEntryScreen() {
    document.getElementById('entryScreen').style.display = "block";
    document.getElementById('specifySizeScreen').style.display = "none";
    document.getElementById('pictureScreen').style.display = "none";
}

function showSpecifySizeScreen() {
    document.getElementById('specifySizeScreen').style.display = "block";
    document.getElementById('entryScreen').style.display = "none";
    document.getElementById('pictureScreen').style.display = "none";
}

function showPictureScreen() {
    document.getElementById('pictureScreen').style.display = "block";
    document.getElementById('entryScreen').style.display = "none";
    document.getElementById('specifySizeScreen').style.display = "none";
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
        console.log("Text box selected");
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