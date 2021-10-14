document.querySelectorAll(".dropInput").forEach((inputElement:Element) => {
    // Finds the closest element with the class dropZone
    const dropZoneElement = inputElement.closest(".dropZone");

    // Add class dropOver when dragging a file over the dropZone div
    dropZoneElement.addEventListener("dragover", (e:Event) => {
        e.preventDefault();
        dropZoneElement.classList.add("dropOver");
    });

    ["dragleave", "dragend"].forEach(type => {
        // Removing dropOver class after leaving dropzone or have dropped the file
        dropZoneElement.addEventListener(type, (e:Event) => {
            dropZoneElement.classList.remove("dropOver");
        });
    });

    dropZoneElement.addEventListener("drop", (e:Event) => {
        e.preventDefault();
        
        // TODO: fix data transfer errors
        // If there is a file
        if (e.dataTransfer.getData("text")) {
            let input:Element = document.querySelector("input.btn");
            const DT:DataTransfer = new DataTransfer();
            let file:File = (new File(['foo'] , e.dataTransfer.getData("text")));
            let nameFile:String = e.dataTransfer.getData("text").toString();
            file.name = nameFile;
            DT.items.add(file);
            input.files = DT.files;
        }

        dropZoneElement.classList.remove("dropOver");
    });
});
