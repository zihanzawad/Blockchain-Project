//invokes onload
(async function () {
    await $.get("/getName", function (data) {
        $('#displayName').text(data);
        $('#newName').val(data);
    });
    await $.get("/getEmail", function (data) {
        $('#displayEmail').text(data);
        $('#newEmail').val(data);
    });
})();