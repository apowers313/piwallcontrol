//Lets require/import the HTTP module
var http = require("http");
var fs = require ("fs");
var url = require ("url");
var proc = require("child_process");

//Lets define a port we want to listen to
var PATH = "/home/pi/media/"; // note trailing slash
var IGNORE_LIST = [
  "Network Trash Folder",
  "Temporary Items",
  "default"
];
var CMD = "/home/pi/bin/allwallstart";
var PORT = 8080;

//We need a function which handles requests and send response
function handleRequest(request, response) {
  var requestUrl = url.parse (request.url, true);
  console.log ("Request path:", requestUrl.pathname);

  switch (requestUrl.pathname) {
    case "/":
    case "/index.html":
    case "/index.htm":
      doIndex (response);
      break;
    case "/list":
      doList (response);
      break;
    case "/play":
      doPlay (response, requestUrl);
      break;
    default:
      response.end ("404: Not Found");
  }
}

function mkList() {
  var files = fs.readdirSync (PATH);
  return files
    .filter(function (f) { return IGNORE_LIST.indexOf(f) === -1; })
    .filter(function (f) { return f[0] !== "."; });
}

function fileLink(file) {
  // console.log("FILE:", file);
  // var fileLink =
  //   "<a href=/play?play=" + file + ">" +
  //  file +
  //  "</a>" +
  //  "<br>\n";
  // console.log("FILE LINK:", fileLink);
  var fileLink =
    '<form action="/play">\n' +
    '  <input type="hidden" name="play" value="' + file + '">\n' +
    '  <input type="submit" value="' + file + '">\n' +
    '</form>\n\n';

  return fileLink;
}

function doIndex (response) {
  var fileList = mkList();

  var indexStr = "";
  indexStr += "<title>VideoWall</title>";
  indexStr += "<meta content='width=device-width, initial-scale=1' name='viewport'/>";
  indexStr += "<h1>VideoWall</h1>";
  indexStr += "<br>";

  var i;
  for (i = 0; i < fileList.length; i++) {
    indexStr += fileLink(fileList[i]);
  }

  response.writeHead(200, {
    'Content-Length': indexStr.length,
    'Content-Type': 'text/html' });
  response.end (indexStr, "utf8");
}

function doList (response) {
  var fileStr = mkList().join("\n");
  fileStr += "\n";

  response.writeHead(200, {
    'Content-Length': fileStr.length,
    'Content-Type': 'text/plain' });
  response.end (fileStr, "utf8");
}

function doPlay (response, requestUrl) {
  console.log ("doPlay got query:", requestUrl.query);

  if (!requestUrl.query) {
  	response.end ("404 Need query");
  	return;
  }

  if (!requestUrl.query.play) {
  	response.end ("404 Need play query");
  	return;
  }

  var opts = {
  	// cwd: "/home/pi",
  	// env: process.env,
  	// shell: "/bin/bash",
  	detached: true,
  	stdio: [ 'ignore', 'ignore', 'ignore' ]
	//stdio: 'inherit'
  };

  var args = [
	  "-r",
	  PATH + requestUrl.query.play
  ];

  console.log ("playing", requestUrl.query.play);

  var child = proc.spawn (CMD, args, opts);
  child.unref();
  console.log ("spawn done");
  response.end ("Ok");
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function() {
  //Callback triggered when server is successfully listening. Hurray!
  console.log("Server listening on: http://localhost:%s", PORT);
});


