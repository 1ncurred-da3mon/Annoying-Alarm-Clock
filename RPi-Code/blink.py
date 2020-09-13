#!/usr/bin/python3

import serial
import time
import sys
import sound

if __name__ == '__main__':
	if len(sys.argv) <= 1:
		print("Invalid arguments");
		sys.exit(1);
	else:
		ser = serial.Serial("/dev/ttyACM0", 9600, timeout=1)
		ser.flush()
		while True:
			ser.write(b"PING\n")
			line = ser.readline().decode('utf-8').rstrip()
			if line == "REDE" or line == "LIVE":
				break
		def waitFor(target: str) -> None:
			while True:
				ser.write(b"STATUS\n")
				s = ser.readline().decode('utf-8').rstrip()
				print(s)
				if s == target:
					return

		for _ in range(int(sys.argv[1])):
			print("lighting up!")
			ser.write(b"start\n")
			waitFor("Starting lights.")
			sound.playSound()
			time.sleep(.05);
			print("stopping")
			ser.write(b"cut\n")
			waitFor("Stopping lights")
			time.sleep(0.5)
		print("done.")
