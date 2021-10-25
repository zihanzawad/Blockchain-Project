var error = {}
var newNameField = document.getElementById("newName");
var currPassField = document.getElementById("currPassword");
var newPass1Field = document.getElementById("newPassword");
var newPass2Field = document.getElementById("confirmPassword");
var newNameText = document.getElementById("nameHelp");
var currPassText = document.getElementById("currPasswordHelp");
var newPass1Text = document.getElementById("newPasswordHelp");
var newPass2Text = document.getElementById("confirmPasswordHelp");

//invokes onload
(async function () {
    await $.get("/getName", function (data) {
        $('#newName').val(data);
    });
    await $.get("/getEmail", function (data) {
        $('#newEmail').val(data);
    });
})();

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

location.search.substr(1).split("&").forEach(function(item) {error[item.split("=")[0]] = item.split("=")[1]})
if (error.valid == 'error1') {
    newNameText.innerHTML = "Name field is empty";
    newNameField.classList.add("is-invalid");
    currPassField.classList.add("is-invalid");
    newPass1Field.classList.add("is-invalid");
    newPass2Field.classList.add("is-invalid");
}
if (error.valid == 'error2') {
    currPassText.innerHTML = "Password field is empty";
    newNameField.classList.add("is-invalid");
    currPassField.classList.add("is-invalid");
    newPass1Field.classList.add("is-invalid");
    newPass2Field.classList.add("is-invalid");
}
if (error.valid == 'error3') {
    newPass1Text.innerHTML = "Password field is empty";
    newNameField.classList.add("is-invalid");
    currPassField.classList.add("is-invalid");
    newPass1Field.classList.add("is-invalid");
    newPass2Field.classList.add("is-invalid");
}
if (error.valid == 'error4') {
    newPass2Text.innerHTML = "Password field is empty";
    newNameField.classList.add("is-invalid");
    currPassField.classList.add("is-invalid");
    newPass1Field.classList.add("is-invalid");
    newPass2Field.classList.add("is-invalid");
}
if (error.valid == 'error5') {
    newNameText.innerHTML = "Name is invalid";    
    newNameField.classList.add("is-invalid");
    currPassField.classList.add("is-invalid");
    newPass1Field.classList.add("is-invalid");
    newPass2Field.classList.add("is-invalid");
}
if (error.valid == 'error6') {
    currPassText.innerHTML = "Invalid Password";
    newNameField.classList.add("is-invalid");
    currPassField.classList.add("is-invalid");
    newPass1Field.classList.add("is-invalid");
    newPass2Field.classList.add("is-invalid");
}
if (error.valid == 'error7') {
    newPass1Text.innerHTML = "Passwords do not match";
    newPass2Text.innerHTML = "Passwords do not match";
    newNameField.classList.add("is-invalid");
    currPassField.classList.add("is-invalid");
    newPass1Field.classList.add("is-invalid");
    newPass2Field.classList.add("is-invalid");
}
