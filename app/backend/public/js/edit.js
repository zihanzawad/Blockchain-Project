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
    // console.log(document.getElementById("newName").value);
    // console.log(document.getElementById("currPassword").value);
    // console.log(document.getElementById("newPassword").value);
    // console.log(document.getElementById("confirmPassword").value);
    
    let newProfile = {
        newName: document.getElementById("newName").value,
        currPass: document.getElementById("currPassword").value,
        newPass1: document.getElementById("newPassword").value,
        newPass2: document.getElementById("confirmPassword").value
    }

    if (newProfile.newName == "" ){
        alert("Enter Name");
    }
    else if (newProfile.currPass == ""){
        alert("Enter Current Pass");
    } 
    else if (newProfile.newPass1 == "" || newProfile.newPass2 == "" ){
        alert("Enter New pass");
    }
    else {
        await $.post("/saveChanges", newProfile, function (data) {
            alert(data);
            location.reload();
        });
    }
    

}
