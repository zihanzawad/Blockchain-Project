
//invokes onload
(async function () {
    let testUserObj = {};
    await $.get("/getUser", function (data) {
        renderData(data);
    });
    // Datatables
    $(document).ready(function () {
        console.log(document.querySelectorAll("#myTable"))
        $('#myTable').DataTable({
            columnDefs: [
                { orderable: false, targets: 3 },
                { "width": "10%", "targets": 3}
            ]
        });
    });
})();



renderData = (obj) => {
    var tbody = document.querySelector('#myTable').getElementsByTagName('tbody')[0];
    for (item of obj.stored) {
        let row = tbody.insertRow(0);
        var date = row.insertCell(0);
        var fileName = row.insertCell(1);
        var TxHash = row.insertCell(2);

        row.insertCell(3).innerHTML = `
        <form id="compare">
        <div class="tampering">
        <input type="file" name="pdf"/>
        <button type="button" class="btn compareBtn" onclick="compareFile()"> Compare File </button>
        </div>
        </form>
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

async function compareFile() {
    let TxHash = event.target.parentElement.parentElement.parentElement.parentElement.children[2].innerHTML;
    let parent = event.target.parentNode;
    let fileName = event.target.parentNode.children[1].innerHTML
    let url = `http://localhost:8080/compareFile/${TxHash}`;

    let form = event.target.parentElement.parentElement;
    
    let formData = new FormData(form)

    console.log({form,TxHash});

    let data = await fetch(url, {
        method: 'POST',
        body : formData
    })
    // createDownloadable(await data.arrayBuffer(), fileName, parent);
}