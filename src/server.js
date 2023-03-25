"use strict";
exports.__esModule = true;
var express_1 = require("express");
var app = (0, express_1["default"])();
var port = 3333;
app.get('/', function (request, response) {
    response.send('Hello World! - Lucas, FEMA');
});
app.listen(port, function () {
    console.log("Server Running! <3 ");
});
