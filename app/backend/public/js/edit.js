//invokes onload
(async function () {
    let testUserObj = {};
    await $.get("/getUser", function (data) {
        renderData(data);
    });
})();



renderData = (obj) => {
    var displayName = document.getElementById("displayName");
    var displayEmail = document.getElementById("displayEmail");

    displayName.innerHTML = obj.Name;
    displayEmail.innerHTML = obj.Email;
}
