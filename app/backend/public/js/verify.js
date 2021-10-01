
//invokes onload
(async function () {
    let testUserObj = {};
    await $.get("http://localhost:8080/getUser", function (data) {
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



renderData = (obj) => {
    var tbody = document.querySelector('#myTable').getElementsByTagName('tbody')[0];
    console.log(obj);
    for (item of obj.stored) {
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

function createDownloadable(data, fileName, parent) {
    console.log(data)
    let element = document.createElement('a');
    var blob = new Blob([data], { type: 'application/json' });
    console.log(blob);
    element.setAttribute('download', fileName);
    element.setAttribute('target', '_blank');
    var URL = window.URL || window.webkitURL;
    var downloadUrl = URL.createObjectURL(blob);

    element.href = downloadUrl;

    element.style.display = 'none';
    parent.appendChild(element);
    element.click();
}

async function getFile() {
    let TxHash = event.target.parentNode.parentNode.children[2].innerHTML;
    let parent = event.target.parentNode;
    let fileName = event.target.parentNode.parentNode.children[1].innerHTML
    let url = `http://localhost:8080/getFile/${TxHash}`;

    let data = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/octet-stream'
        },
    })
    createDownloadable(await data.arrayBuffer(), fileName, parent);
}