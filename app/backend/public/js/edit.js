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


async function update() {
    console.log(document.getElementById("newName").value);
    console.log(document.getElementById("currPassword").value);
    console.log(document.getElementById("newPassword").value);
    console.log(document.getElementById("confirmPassword").value);
    let input = {

        newName: document.getElementById("newName").value,
        currPass: document.getElementById("currPassword").value,
        newPass1: document.getElementById("newPassword").value,
        newPass2: document.getElementById("confirmPassword").value
    }

    let testUserObj = {email: "jent@email.com", newName: "Jenny", currPass: "123", newPass1: "456", newPass2: "456"};
    
    
    await $.post("/saveChanges", input);

    //checking new data

    //create json that contains all these values

    //req.body

    //send http to server
    //get/post from jquery
}
