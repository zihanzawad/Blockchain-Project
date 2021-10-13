//invokes onload to load user details from session
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

//validates form input and updates database for user profile changes
async function update() {

    let newProfile = {
        newName: document.getElementById("newName").value,
        currPass: document.getElementById("currPassword").value,
        newPass1: document.getElementById("newPassword").value,
        newPass2: document.getElementById("confirmPassword").value
    }
    
    let inputWarning = document.getElementById("inputValidation");
    inputWarning.innerHTML = "";

    if (newProfile.newName == "" ){
        inputWarning.innerHTML = "*Enter New Name";
    }
    else if (newProfile.currPass == ""){
        inputWarning.innerHTML = "*Enter Current Password";
    } 
    else if (newProfile.newPass1 == "" || newProfile.newPass2 == "" ){
        inputWarning.innerHTML  = "*Enter New password";
    }
    else {
        await $.post("/saveChanges", newProfile, function (data) {
            alert(data);
            location.reload();
        });
    }
    

}

$("#edit").click(function () {
    $("#image_upload").trigger('click');
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#profile_picture')
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}
