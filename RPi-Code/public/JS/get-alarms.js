
console.log("file included!");
async function getAlarms() {
	var alarms = new Map();
	const options = {
		method: 'POST',
	};
	const response = await fetch('/list-alarms', options);
	const data = await response.text();
	if (data.toString() == "N/A") {
		var ndiv = document.createElement('div');
		ndiv.setAttribute('id', 'alarms-table-empty');
		ndiv.innerText += "No alarms have been set.";
		document.getElementById("alarms-table-container").appendChild(ndiv);
		return false;
	}
	else {
		{
			let ndiv = document.createElement('div');
			ndiv.setAttribute('id', 'alarms-table');
			document.getElementById('alarms-table-container').appendChild(ndiv);
		}
		let dsplit = data.toString().split('::');
		
		for (let i = 0; i < dsplit.length - 1; i++) {
			console.log(dsplit[i].split(',')[0] + '\t' + dsplit[i].split(',')[1]);
			let alarm_name = dsplit[i].split(',')[0];
			let alarm_time = dsplit[i].split(',')[1];

			let tableobj = document.createElement('button');
			sessionStorage.setItem(alarm_name, alarm_time);
			tableobj.setAttribute('id', 'alarm-obj-'+alarm_name);
			tableobj.setAttribute('class', 'alarm-obj');
			tableobj.setAttribute('onclick', 'window.location.href="http://192.168.6.1:8080/edit-alarm/' + alarm_name + '"');
			tableobj.innerHTML = alarm_name + "@ " + alarm_time; 
			document.getElementById('alarms-table').appendChild(tableobj);
		}

		return true;
	}
};

window.onload = getAlarms();