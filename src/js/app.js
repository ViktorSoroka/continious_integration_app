var sumModule = require("../../src/js/all");

$(function () {
    "use strict";
    $("#main-content").html(sumModule.sum(100000, 500));
});
