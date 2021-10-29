    // Finds the closest element with the class dropZone
    var dropZoneElement = document.getElementById("dropzone");

    /*inputElement.addEventListener("change", (e) => {
        updateThumbnail(dropZoneElement, inputElement.files[0]);
    });*/

    // Add class dropOver when dragging a file over the dropZone div
    dropZoneElement.addEventListener("dragover", e => {
        e.preventDefault();
        dropZoneElement.classList.add("dropOver");
    });

    ["dragleave", "dragend"].forEach(type => {
        // Removing dropOver class after leaving dropzone or have dropped the file
        dropZoneElement.addEventListener(type, e => {
            dropZoneElement.classList.remove("dropOver");
        });
    });

    dropZoneElement.addEventListener("drop", e => {
        e.preventDefault();
        uploadPDF.files = e.dataTransfer.files;

        dropZoneElement.classList.remove("dropOver");
    });


/*function updateThumbnail(dropZoneElement, file) {
    let thumbanilElement = dropZoneElement.querySelector(".dropThumb");
    // Removing the text and upload image
    if (dropZoneElement.querySelector(".dropPrompt")) {
        dropZoneElement.querySelector(".dropPrompt").remove;
    }
    //const imageElement = inputElement.closest(".uploadImg");
    //if (imageElement.querySelector(".uploadImg")) {
        //imageElement.classList.add("dropInput");
    //}
    // Add image
    if (!thumbanilElement) {
        thumbanilElement = document.elementFromPoint("div");
        thumbanilElement.classList.add("dropThumb");
        dropZoneElement.appendChild(thumbanilElement);
    }
    thumbanilElement.dataset.label = file.name;
    if (file.type.startsWith("file")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbanilElement.style.backgroundImage = `url('${reader.result}')`;
        };
    } else {
        thumbanilElement.style.backgroundImage = null;
    }
}*/

// document.querySelector(".")