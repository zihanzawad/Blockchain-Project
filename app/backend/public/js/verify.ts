import * as $ from "jquery";

// This file requires:
// npm install @types/jquery --save-dev 
// npm install jquery --save 
// npm install @types/datatables.net

const renderData = (obj) => {
    var tbody = document.querySelector('#myTable').getElementsByTagName('tbody')[0];
    for (let item of obj.stored) {
        let row = tbody.insertRow(0);
        var date = row.insertCell(0);
        var fileName = row.insertCell(1);
        var TxHash = row.insertCell(2);
        row.insertCell(3).innerHTML = `
        <button onclick="getFile()"> Get This File </button>
        `;
        date.innerHTML = item.Date;
        fileName.innerHTML = item.fileName;
        TxHash.innerHTML = item.TxHash;
    }
}

//invokes onload
(async function () {
    let testUserObj = {};
    await $.get("/getUser", function (data:any) {
        renderData(data);
    });
    // Datatables
    $(document).ready(function () {
        console.log(document.querySelectorAll("#myTable"))
        $('#myTable').DataTable({
            columnDefs: [
                { orderable: false, targets: 3 }
            ]
        });
    });
})();


function createDownloadable(data:any, fileName:string, parent:any) {
    console.log(data)
    let element:any = document.createElement('a');
    var blob:Blob = new Blob([data], { type: 'application/json' });
    console.log(blob);
    element.setAttribute('download', fileName);
    element.setAttribute('target', '_blank');
    var URL = window.URL || window.webkitURL;
    var downloadUrl:string = URL.createObjectURL(blob);

    element.href = downloadUrl;

    element.style.display = 'none';
    parent.appendChild(element);
    element.click();
}

async function getFile() {
    let el:Element = event.target as Element;
    let TxHash:string = el.parentNode.parentNode.children[2].innerHTML;
    let parent:Node&ParentNode = el.parentNode;
    let fileName:string = el.parentNode.parentNode.children[1].innerHTML;
    let url:string = `http://localhost:8080/getFile/${TxHash}`;

    let data = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/octet-stream'
        },
    })
    createDownloadable(await data.arrayBuffer(), fileName, parent);
}