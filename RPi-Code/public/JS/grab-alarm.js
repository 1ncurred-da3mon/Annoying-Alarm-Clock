var url = window.location.href;
var extracted_name = url.substr(url.lastIndexOf('/')+1, url.length).split('%20').join(' ');


async function grabAlarmTime() {
	const options = {
		method: 'POST',
	};
	const response = await fetch('/find-alarm/' + extracted_name, options);
	const recvdata = await response.text();
	if (recvdata == "N/A") {
		alert("We could not find a timer for " + extracted_name);
	}
	else {
		let input_name = document.getElementById('alarm-name');
		input_name.value = extracted_name;
		let time_input_box = document.getElementById('alarm-set');
		time_input_box.value = recvdata;
	}
}

window.onload = grabAlarmTime();