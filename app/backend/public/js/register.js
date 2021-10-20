var error = {}
var emailText = document.getElementById("emailHelp");
var nameText = document.getElementById("nameHelp");
var passwordText = document.getElementById("passwordHelp");
var confirmPasswordText = document.getElementById("confirmPasswordHelp");
var emailField = document.getElementById("Email");
var nameField = document.getElementById("Name");
var passwordField = document.getElementById("Password");
var confirmPasswordField = document.getElementById("confirmPassword");
location.search.substr(1).split("&").forEach(function(item) {error[item.split("=")[0]] = item.split("=")[1]});
if (error.valid == 'error1') {
    emailText.innerHTML = "Email field is empty";
    emailField.classList.add("is-invalid");
    nameField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
    confirmPasswordField.classList.add("is-invalid");
}
if (error.valid == 'error2') {
    nameText.innerHTML = "Name field is empty";
    emailField.classList.add("is-invalid");
    nameField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
    confirmPasswordField.classList.add("is-invalid");
}
if (error.valid == 'error3') {
    passwordText.innerHTML = "Password field is empty";
    emailField.classList.add("is-invalid");
    nameField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
    confirmPasswordField.classList.add("is-invalid");
}
if (error.valid == 'error4') {
    confirmPasswordText.innerHTML = "Password field is empty";
    emailField.classList.add("is-invalid");
    nameField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
    confirmPasswordField.classList.add("is-invalid");
}
if (error.valid == 'error5') {
    emailText.innerHTML = "Email is invalid";
    emailField.classList.add("is-invalid");
    nameField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
    confirmPasswordField.classList.add("is-invalid");
}
if (error.valid == 'error6') {
    nameText.innerHTML = "Name is invalid";    
    emailField.classList.add("is-invalid");
    nameField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
    confirmPasswordField.classList.add("is-invalid");
}
if (error.valid == 'error7') {
    passwordText.innerHTML = "Passwords do not match";
    confirmPasswordText.innerHTML = "Passwords do not match";
    emailField.classList.add("is-invalid");
    nameField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
    confirmPasswordField.classList.add("is-invalid");
}
if (error.valid == 'error8') {
    emailText.innerHTML = "The email has been taken";
    emailField.classList.add("is-invalid");
    nameField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
    confirmPasswordField.classList.add("is-invalid");
}