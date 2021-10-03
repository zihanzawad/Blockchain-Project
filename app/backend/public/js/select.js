//invokes onload
(async function () {
    await $.get("/getName", function (data) {
        $('#nameHeader').text("Welcome " + data);
    });
})();