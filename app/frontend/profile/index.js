

//invokes onload
(async function () {
    let testUserObj = {};
    await $.get("http://localhost:8080/getUser", function (data) {
        renderData(data);
    });

})();

renderData = (obj)=>{
    var tbody = document.querySelector('.table').getElementsByTagName('tbody')[0];
    for (item of obj.stored) {
        let row = tbody.insertRow(0);
        var date = row.insertCell(0);
        var fileName = row.insertCell(1);
        var TxHash = row.insertCell(2);
        date.innerHTML = item.Date;
        fileName.innerHTML = item.fileName;
        TxHash.innerHTML = item.TxHash;
    }
}