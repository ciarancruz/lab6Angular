// Initialize buttons
const startNewButton = document.getElementById("startNewButton");
startNewButton.addEventListener("click", startNewPicture);
const retrieveExistingButton = document.getElementById("retrieveExistingButton");
// retrieveExistingButton.addEventListener("click", );


// Show or hide screens
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

// Initialize screens
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

    // Create grid
    for(let i = 0; i < sizeGrid; i++) {
        for(let j = 0; j < sizeGrid; j++) {
            numBoxesCreated += `<div class="col"></div>`
        }
    }

    document.querySelector(".container").innerHTML = numBoxesCreated;
}