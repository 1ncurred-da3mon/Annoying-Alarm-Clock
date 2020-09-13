#!/usr/bin/python3
import os       # used to check if a file is empty
import sys      # used to exit the script with a specific exit code

if __name__ == '__main__':
    
    if os.stat('./alarmsdb/alarm_status.txt').st_size == 0 or open('./alarmsdb/alarm_status.txt', 'r').read() == 'off':
        # file is empty or does not contian the text 'off'
        sys.exit(1)
    elif open('./alarmsdb/alarm_status.txt', 'r').read() == 'on':
        # file contents equals 'on'
        sys.exit(0)