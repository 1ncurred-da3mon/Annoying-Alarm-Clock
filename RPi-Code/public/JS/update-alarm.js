var url = window.location.href;
var extracted_name = url.substr(url.lastIndexOf('/')+1, url.length).split('%20').join(' ');

async function updateAlarm() {
	let alarm_time = document.getElementById('alarm-set').value;
	let new_alarm_name = document.getElementById('alarm-name').value;
	if (alarm_time.length == 0)
		alert("You must put in a time!");
	else if (new_alarm_name.length == 0) 
		alert("YOu must put a name for your alarm!");
	else {
		const options = { method: 'POST',};
		const response = await fetch('/modalarm/' + extracted_name + '/' + new_alarm_name + '/' + alarm_time, options);
		const data = await response.text();
		if (data.toString() == "OK")
			alert("Your timer has been updated!");
		else
			alert("There was a problem updating your alarm");
	}
}

async function deleteAlarm() {
	const options = { method: 'POST',};
	const response = await fetch('/del-alarm/' + extracted_name, options);
	const data = await response.text();
	if (data.toString() == "OK") {
		alert("You have successfully deleted your alarm!");
		window.history.back();
	}
	else
		alert("There was a problem deleting your alarm.");

}
