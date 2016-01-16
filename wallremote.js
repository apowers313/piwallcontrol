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

function doList (response) {
  var files = fs.readdirSync (PATH);
  var fileStr = "";
  var i;
  for (i = 0; i < files.length; i++) {
    if (files[i][0] == ".") continue;
    if (IGNORE_LIST.indexOf(files[i]) !== -1) continue;
    fileStr = fileStr + files[i];
    if (i != (files.length - 1)) fileStr += "\n";
  }

  response.end (fileStr);
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


