require("dotenv").config();
var http = require("http");
require("./agenda_processor");

var server = http.createServer(function(req, res) {
    res.writeHead(200);
    res.end("Hello world");
});
server.listen(8000, function() {
    console.log("Server running on port 3000");
});
