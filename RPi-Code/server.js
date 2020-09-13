var express = require('express'); // require express to assist with help and get requests
var app = express();

const util = require('util');
const exec = util.promisify(require('child_process').exec);

// File management
const readline = require('readline');
const fs = require('fs');
const { filterSeries } = require('async');

// Creating child processes
var spawn = require('child_process').spawn;
var node_alarm_script = spawn;

// Alarms
var alarms = new Map();
// Start storing all the alarms into the map
ReadDatabaseFile(); 

// allow the get requests to get any javascript and CSS files
app.use(express.static(__dirname + '/public'));

// Gets

// Home Page
app.get('/home', function (req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

// Create Alarm Page
app.get('/create-alarm', function (req, res) {
	res.sendFile(__dirname + "/public/create-button.html");
});

// Alarms List Page
app.get('/alarms-list', function(req, res) {
	res.sendFile(__dirname + "/public/alarms-list.html");
});

// Edit Alarm Page
app.get('/edit-alarm/:name', function(req, res) {
	res.sendFile(__dirname + "/public/edit-alarm.html");
});

// POSTS

/*
	add-alarm [POST]
		* add an alarm to the map.
		* requires:
			- The time for the alarm
			- The name for the alarm
*/
app.post("/add-alarm/:time/:name", function (req, res) {
	let data = req.params;
	let time = data.time;
	let name = data.name;
	
	let notInAlarms = true;

	// Check if the alarms already contains the same name
	// Do not allow duplicates or over-writing
	if (alarm.has(name)) {
		res.send("Invalid alarm! Alarm already exists");
	}

	for (let alarm of alarms) {
		if (name == alarm[0]) {
			console.log("Alarm already exists!");
			notInAlarms = false;
			res.send("Invalid alarm! Alarm already exists");
		}
	}

	 // else

	if (notInAlarms){ 
		alarms.set(name, time);
		console.log("Added an alarm!");
		console.log("Added", name, time);
		res.send("You alarm has been added!");
		WriteUpdateFile();
	}
});

/*
	list-alarms [POST]
		* gets a list of all the alarms.
*/
app.post('/list-alarms', function (req, res) {
	// no alarms have been made
	if (alarms.size == 0) {
		console.log("No alarms are set!");
		res.send("N/A");
	}
	else {
		var ret = "";
		// loop through the alarms and add them to ret
		for (let t of alarms) {
			ret = ret + t + "::";
		}
		res.send(ret);
	}
});

/*
	find-alarm [POST]
		* returns an alarm's time.
		* requires:
			- an alarm name
*/
app.post('/find-alarm/:name', function (req, res) {
	let data = req.params;
	let timename = data.name;
	let isinTimes = false;

	// if the requested name is in the alarms
	/* Possible fix for code:
		if (alarms.has(timename)) {
			res.send(alarms.get(timename));
		}
	*/
	for (let To of alarms) {
		if (To[0] == timename) {
			isinTimes = true;
			break;
		}
	}
	if (isinTimes) {
		res.send(alarms.get(timename));
	}
	else
		res.send("N/A");
});

/*
	modalarm [POST]
		* modify an alarm (whether it be a new name or time)
		* requires:
			- the alarm's new name
			- the previous alarm's new name
			- the alarm's new time
*/
app.post('/modalarm/:newname/:prevname/:time', function (req, res) {
	let params = req.params;
	let previous_alarm_name = params.prevname;
	let new_alarm_name = params.newname;
	let new_time = params.time;

	// if the previous alarm is non-existant, it will not update.
	if (!alarms.has(previous_alarm_name))
		res.send("NON_EXISTANT");
	else {
		// delete the previous alarm, and create the new one
		alarms.delete(previous_alarm_name);
		alarms.set(new_alarm_name, new_time);
		res.send('OK');
	}
	// update the database
	WriteUpdateFile();
});

/*
	del-alarm [POST]
		* delete an alarm
		* requires:
			- alarm's name
*/
app.post('/del-alarm/:name', function (req, res) {
	let params = req.params;
	// ignore if the name provided is not in the alarms map
	if (!alarms.has(params.name))
		res.send('NON_EXISTANT');
	else {
		alarms.delete(params.name);
		res.send('OK');
	}
	// update the database
	WriteUpdateFile();
});

/*
	get-close-time [POST]
		* return the amount of alarms set
*/
app.post('/get-close-time', function(req, res) {
	res.send(alarms.size.toString());
});

/*
	stop-alarm [POST]
		* attempt to stop the alarm
*/
app.post('/stop-alarm', async function(req, res) {
	// check if the alarm is going off
	let alarm_checker = spawn('python3', ['./check-status.py'], {detatched: true});
	
	// timeout until we check if it the "alarm_checker" returned 0 or anything else
	setTimeout(function() {
		// alarm is on, write 'off' to the alarm_status.txt
		if (alarm_checker.exitCode == 0) {
			res.send('OK');
			// tell the pi to stop the alarm
			let killer = spawn('python3', ['./stop-alarm.py'], {detatched: true});
		}
		// the alarm_status is off or there was a problem reading.
		else {
			res.send('Alarm is currently not active.');
		}
	}, 500);

});

/*
	kill [POST]
		* kill the server, using a password (only an administrator can shut it down)
*/
app.post('/kill/:password', function(req, res) {
	let p = req.params;
	
	// iwtd
	if (p.password == "killme") {
		res.send("Valid password! Shutting down!");
		// update the database once more
		WriteUpdateFile();
		// kill the python script
		node_alarm_script.kill();
		// close the server
		setTimeout(function() {
			server.close();
		}, 3000);
	}
	else
		res.send("Invalid password!");
});



// Listen on port 8080. IP address is custom.
var server = app.listen(8080, "192.168.6.1", function() {
	node_alarm_script = spawn('python3', ['./alarm_script.py'], {stdio: [process.stdin, process.stdout, process.stderr], detatched : true});
	console.log("Server is now listening on 192.168.6.1:8080");
});


// Writes to the alarms.tsv file.
function WriteUpdateFile() {
	let data = "";
	for (let alarm of alarms) {
		data = data + alarm[0] + "\t" + alarm[1] + '\n';
	}
	fs.writeFile('./alarmsdb/alarms.tsv', data, function (err, d) {
		if (err)
			console.log("There was an error writing to the file.");
		else 
			console.log("Updated! File Contents: " + d);
	})
}

// reads the database and stores the variables into the alarms map
async function ReadDatabaseFile() {
	// Check if the file is empty.
	fs.readFile('./alarmsdb/alarms.tsv', function(err, data) {
		if (data.length == 0) {
			console.log("File is empty!");
			return;
		}
	});

	// Set variables to the map
	const filestream = fs.createReadStream('./alarmsdb/alarms.tsv');
	const rl = readline.createInterface({
		input: filestream,
		crlfDelay: Infinity
	});
	for await (const line of rl) {
		alarms.set(line.split('\t')[0], line.split('\t')[1]);
	}
}