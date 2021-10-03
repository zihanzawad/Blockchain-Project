var error = {}
var emailText = document.getElementById("emailHelp");
var passwordText = document.getElementById("passwordHelp");
var successText = document.getElementById("success");
var emailField = document.getElementById("Email");
var passwordField = document.getElementById("Password");
location.search.substr(1).split("&").forEach(function(item) {error[item.split("=")[0]] = item.split("=")[1]})
if (error.valid == 'error1') {
    emailText.innerHTML = "Invalid/incorrect email or password";
    passwordText.innerHTML = "Invalid/incorrect email or password";
    emailField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
}
if (error.valid == 'error2') {
    emailText.innerHTML = "Email field is empty";
    emailField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
}
if (error.valid == 'error3') {
    passwordText.innerHTML = "Password field is empty";
    emailField.classList.add("is-invalid");
    passwordField.classList.add("is-invalid");
}
if (error.valid == 'success') {
    successText.innerHTML = "User has been registered!";
}