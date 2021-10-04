/*tooltip function*/
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});

var viewer = document.getElementById('viewer');
/*append each image to div*/
function appendImg(doc,srcImg) {
    var img = document.createElement('img');
    img.className = "img-fluid page";
    img.src = srcImg;
    img.style.width = '70%';
    doc.appendChild(img);
}

// append fake imgs
let arr = ['media/test_page1.jpg','media/test_page2.jpg'];
for (let i = 0; i < 2; i++) {
    appendImg(viewer,arr[i]);
}

var viewSize = 70;
document.getElementById('counter').innerHTML = String(viewSize)+'%';
/* Zoom in on document*/
function zoomIn() {
    var cols = document.getElementsByClassName('page');
    if (viewSize<=85 && viewSize>=10) { viewSize += 15;}
    
    for(i = 0; i < cols.length; i++) {
        cols[i].style.width = String(viewSize) + '%';
    }
    document.getElementById('counter').innerHTML = String(viewSize)+'%';
}
/*Zoom out on document*/
function zoomOut() {
    if (viewSize<=100 && viewSize>=25) {
        viewSize -= 15;
    }
    
    var cols = document.getElementsByClassName('page');
    for(i = 0; i < cols.length; i++) {
        cols[i].style.width = String(viewSize) + '%';
    }
    document.getElementById('counter').innerHTML = String(viewSize)+'%';
}

/*get fullscreen*/
var el = document.getElementById("screen");
function fullscr() {
    if (el.requestFullscreen) {
        el.requestFullscreen();
    /*fullscreen for internet explorer browser*/
    } else if (el.msRequestFullscreen) { 
        el.msRequestFullscreen();  
    /*fullscreen for safari browser*/
    } else if (el.webkitRequestFullscreen) { 
        el.webkitRequestFullscreen();
    } 
}