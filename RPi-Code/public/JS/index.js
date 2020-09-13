async function updateCountDown() {
	const options = { method: 'POST', };
	const response = await fetch('/get-close-time', options);
	const rdata = await response.text();

	let timeobj = document.createElement('h1');
	timeobj.setAttribute('id', 'AlarmCount');
	timeobj.setAttribute('class', 'countdown');
	let time_name = document.createElement('h3');
	time_name.setAttribute('id', 'AlarmsLabel');
	time_name.setAttribute('class', 'countdown');

	let timer_countdown = document.getElementById('countdown-container');

	if (rdata == 'NO_ALARM') {
		timeobj.innerText = '';
		time_name.innerText = 'No alarms are currently set.';
		timer_countdown.appendChild(timeobj);
		timer_countdown.appendChild(time_name);
	}
	else {
		timeobj.innerText = rdata;
		time_name.innerText = "Alarms";
		timer_countdown.appendChild(timeobj);
		timer_countdown.appendChild(time_name);
	}
}

async function stopAlarm() {
	const options = {method: 'POST',};
	const response = await fetch('/stop-alarm', options);
	const rdata = await response.text();
	if (rdata == 'OK') {
		console.log('Alarm is stopped.');
		alert('You alarm is stopped!');
	}
	else {
		alert('There is no current active alarm.');
	}
}

window.onload = updateCountDown();