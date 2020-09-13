async function verifyAlarm() {
	console.log("Interpreting data...");
	let alarm_time = document.getElementById("alarm-set").value;
	let alarm_name = document.getElementById("alarm-name").value;
	if (alarm_time.length == 0)
		alert("You must put in a time!");
	else if (alarm_name.length == 0)
		alert("You must put a name for your alarm!");
	else {
		console.log("Ready. Sending POST.");
		const options = {
			method: 'POST',
		};
		const response = await fetch('/add-alarm/'+ alarm_time + '/' + alarm_name, options);
		const data = await response.text();
		alert(data);
	}
}
