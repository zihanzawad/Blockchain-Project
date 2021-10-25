error = {}
var successText = document.getElementById("success");
location.search.substr(1).split("&").forEach(function(item) {error[item.split("=")[0]] = item.split("=")[1]})
if (error.valid == 'success1') {
    successText.innerHTML = "Profile has been updated!";
}
if (error.valid == 'success2') {
    successText.innerHTML = "File has been uploaded!";
}