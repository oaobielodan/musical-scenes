document.addEventListener("DOMContentLoaded", function() {

    // get elements
    const plane = document.getElementById("plane");
    const background = document.getElementById("backgroundContainer");

    // set variables
    const minFlowerX = 125;
    const maxFlowerX = 1675;
    const minFlowerY = 350;
    const maxFlowerY = 900;

    let animation;
    let deleting = false;
    let planeStyle = getComputedStyle(plane);
    
    // initialize instruments
    const synth = new Tone.PolySynth().toDestination();
    const piano = SampleLibrary.load({instruments: "piano"}).toDestination();
    const violin = SampleLibrary.load({instruments: "violin"}).toDestination();
    const guitar = SampleLibrary.load({instruments: "guitar-acoustic"}).toDestination();


    // ----------- Musical maping ----------- //

    // function to map flower's y-coordinate to musical notes
    function mapYToNote(y) {
        const note = Tone.Frequency(y).toNote(); // Convert y-coordinate to a musical note
        return note;
    }

    // function to get the note at the flower's position
    function noteAtX(x) {
        const y = x;
        const note = mapYToNote(y);
        return note;
    }

    // function to play a note based on the airplane's position over flower and type of flower
    function playNoteBasedOnX(x, type) {
        const note = noteAtX(x);

        if (type.includes("single")){
            synth.triggerAttackRelease(note, "8n");
        } else if (type.includes("double")){
            piano.triggerAttackRelease(note, "4n");
        } else if (type.includes("purple")){
            violin.triggerAttackRelease(note, "4n");
            console.log(note);
        } else if (type.includes("orange")){
            guitar.triggerAttackRelease(note, "4n");
        }
    }


    // ----------- Moving the plane ----------- //

    // set the initial position and speed variables
    let planePosition = parseFloat(planeStyle.left);
    let position = planePosition;
    let speed = 10;

    let flowerPositions = [];

    // function to move the plane
    function movePlane() {
        position -= speed;
        plane.style.left = position + "px";

        // check if the plane is over the flower and play note
        for (const flower of flowerPositions) {
            let flowerStyle = getComputedStyle(flower);
            let flowerPosition = parseFloat(flowerStyle.left);

            if (Math.abs(position - flowerPosition) <= 5) {
                playNoteBasedOnX(flowerStyle.top, flower.children[0].src);
                break;
            } 
        }

        // check if the plane has reached the end of the screen
        if (position < background.style.left - plane.clientWidth) {
            // reset the position to the starting point
            position = background.style.left + background.clientWidth;
            plane.style.left = position + "px";
        }

        animation = requestAnimationFrame(movePlane); // Continue the animation
    }

    let first = true;

    async function startAnimation() {
        if(first){
            await Tone.start();
            first = false;
        }
        animation = requestAnimationFrame(movePlane);
    }
    
    function stopAnimation() {
        cancelAnimationFrame(animation);
    }


    // ----------- Adding a flower ----------- //

    let source = "";
    let lastClicked = null;
    
    // function to select a flower
    function flowerSelected(allFlowers){
        allFlowers.forEach(flower => {
            flower.addEventListener("click", function(){
                if (this.classList.contains("clicked")){
                    source = "";   
                } else {
                    source = this.children[0].src;      
                }

                if (this === lastClicked){
                    this.classList.toggle("clicked");
                } else{
                    if (lastClicked) {
                        lastClicked.classList.remove("clicked");
                    }
    
                    this.classList.add("clicked");
                    lastClicked = this;
                }
            });
        });
    }

    let newDiv;
    let newFlower;
    let flowerCount = 0;
    
    // function to add a new flower
    function addFlower(){
        if (source != ""){
            flowerCount += 1;
            let newID = "newFlower" + flowerCount;

            newDiv = document.createElement("div");
            newFlower = document.createElement("img");

            newFlower.src = source;
            newFlower.setAttribute("height", 160);
            newFlower.setAttribute("draggable", true);

            newDiv.style.left = "650px"; 
            newDiv.style.top = "500px"; 
            newDiv.style.position = "absolute";
            newDiv.style.display = "flex";

            newDiv.setAttribute("id", newID);
            newDiv.appendChild(newFlower);
            newDiv.className = "scene";

            document.body.appendChild(newDiv);
            flowerPositions.push(newDiv);
            dragFlower(document.getElementById(newID));
        }
    }


    // ----------- Moving the flowers ----------- //

    // functions to drag flowers around
    function dragFlower(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.onmousedown = dragMouseDown;
      
        function dragMouseDown(e) {
            e.preventDefault();

            // get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;

            // call a function whenever the cursor moves
            document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
            e.preventDefault();

            // calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // calculate the element's new position
            let newLeft = (elmnt.offsetLeft - pos1);
            let newTop = (elmnt.offsetTop - pos2);

            // restrict the movement
            newLeft = Math.min(Math.max(newLeft, minFlowerX), maxFlowerX - elmnt.offsetWidth);
            newTop = Math.min(Math.max(newTop, minFlowerY), maxFlowerY - elmnt.offsetHeight);
        
            // set the element's new position
            elmnt.style.top = newTop + "px"; // new top
            elmnt.style.left = newLeft + "px"; // new left
        }
      
        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }  
    }


    // ----------- Deleting flowers ----------- //
    
    // function to set delete mode
    function deleteMode() {
        if (this.checked) {
          deleting = true;
          document.getElementById("deleting").style.visibility = "visible";

          sceneFlowers = document.querySelectorAll(".scene");
          deleteFlowerSelected(sceneFlowers);
        } else {
          deleting = false;
          document.getElementById("deleting").style.visibility = "hidden";
        }
    }

    // function to delete flowers
    function deleteFlowerSelected(allFlowers){
        allFlowers.forEach(flower => {
            flower.addEventListener("click", function(){
                const removedFlower = this;
                const index = flowerPositions.indexOf(removedFlower);

                if(deleting){
                    document.body.removeChild(removedFlower);

                    if (index > -1) {
                        flowerPositions.splice(index, 1);
                    } 
                }
            });
        });
    }

    // function to reset scene
    function resetScene() {
        for (let i = 1; i <= flowerCount; i++){
            const removedFlower = document.getElementById("newFlower" + i);

            console.log(removedFlower);

            if (removedFlower == null){
                continue;
            }

            const index = flowerPositions.indexOf(removedFlower);

            document.body.removeChild(removedFlower);

            if (index > -1) {
                flowerPositions.splice(index, 1);
            }   
        }

        flowerCount = 0;
        plane.style.left = "1500px";
        position = 1500;

        stopAnimation();
    }



    // ----------- User interaction ----------- //

    // Buttons and actions
    const start = document.getElementById("start");
    const stop = document.getElementById("stop");
    const addnew = document.getElementById("addnew");
    const reset = document.getElementById("reset");
    const remove = document.getElementById("remove");

    start.addEventListener("click", startAnimation);
    stop.addEventListener("click", stopAnimation); 
    addnew.addEventListener("click", addFlower);
    reset.addEventListener("click", resetScene);
    remove.addEventListener("change", deleteMode);

    const selectorFlowers = document.querySelectorAll(".flower");
    flowerSelected(selectorFlowers);
});

