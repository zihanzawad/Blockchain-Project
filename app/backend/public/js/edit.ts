import * as $ from "jquery";

// This file requires:
// npm install @types/jquery --save-dev 
// npm install jquery --save 

var error:any = {}
var newNameField: any = document.getElementById("newName");
var currPassField: any = document.getElementById("currPassword");
var newPass1Field:any= document.getElementById("newPassword");
var newPass2Field:any = document.getElementById("confirmPassword");
var newNameText:any = document.getElementById("nameHelp");
var currPassText:any = document.getElementById("currPasswordHelp");
var newPass1Text:any= document.getElementById("newPasswordHelp");
var newPass2Text:any = document.getElementById("confirmPasswordHelp");

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
    //let testUserObj = {};
    await $.get("/getUser", function (data) {
        renderData(data);
    });
})();


const renderData = (obj:any) => {
    var displayName: any = document.getElementById("displayName");
    var displayEmail: any = document.getElementById("displayEmail");

    displayName.innerHTML = obj.Name;
    displayEmail.innerHTML = obj.Email;
}

$("#edit").click(function () {
    $("#image_upload").trigger('click');
});

function readURL(input:any) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e:any) {
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