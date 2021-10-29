    // Finds the closest element with the class dropZone
    dropZoneElement = document.getElementById("thedropzone");

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
        // If there is a file
        // if (e.dataTransfer.getData("pdf")) {
        //     let input = document.querySelector("input.btn");
        //     const DT = new DataTransfer();
        //     let file = (new File(['foo'] , e.dataTransfer.getData("pdf")));
        //     file.name = e.dataTransfer.getData("pdf");
        //     DT.items.add(file);
        //     input.files = DT.files;
        // }
        uploadPDF.files = e.dataTransfer.files;

        // If you want to use some of the dropped files
        const dT = new DataTransfer();
        dT.items.add(e.dataTransfer.files[0]);
        //dT.items.add(e.dataTransfer.files[3]);
        uploadPDF.files = dT.files;

        dropZoneElement.classList.remove("dropOver");
    });


Dropzone.options.dropzoneFrom = {
    autoProcessQueue: false, 
    paramName: "pdf",
    acceptedFiles:".pdf",
    uploadMultiple: false,
    init: function(){
        var myDropzone = this;
        this.element.querySelector("button[type=submit]").addEventListener("click", function(e) {
            // Make sure that the form isn't actually being sent.
            e.preventDefault();
            e.stopPropagation();
            myDropzone.processQueue();
        });
        
    // var submitButton = document.querySelector('#submit-all');
    //  myDropzone = this;
    //  submitButton.addEventListener("click", function(){
    //  myDropzone.processQueue();
    //  });
     this.on("complete", function(){
      if(this.getQueuedFiles().length == 0 && this.getUploadingFiles().length == 0)
      {
       var _this = this;
       _this.removeAllFiles();
      }
      testing();
     });
    },
   };

function testing()
 {
   console.log("testing");
 }



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