## The Annoying Alarm Clock
The Annoying Alarm Clock is a personal project that uses the Raspberry Pi and an Arduino to manage Alarms, and play audio via speaker.

The Pi hosts a web server via NodeJS, and communicates with the Arduino over Serial. The Pi has a speaker connected via 3.5mm headphone jack, and when the user's alarm is met, the Pi tells the Arduino to blink 9 LEDs, then sets the Pi's volume to max, and continuously plays loud audio until the user turns it off.

The user must connect to the Pi's WiFi to use the interface. The user can create numerous alarms, and edit or delete previously made alarms.

This project was a learning experience, as I personally am learning NodeJS for the first time, and learning on creating circuits via Arduino and the LEDs.