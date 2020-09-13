#!/usr/bin/python3

import os                   # used to read file sizes
import time                 # sleep for a small amount of time
import signal               # used to kill processes
import datetime as date     # used to get time
import subprocess as subp   # run subprocesses


# Creates a dictionary to store all the alarm onto
alarms = dict()

def get_acc_time() -> str:
    '''
    get the current time, using the HH:MM:SS format
    '''
    d = date.datetime.now()
    return d.strftime('%H:%M:%S')

def read_db_file():
    '''
    read all the alarms found in the alarms database folder
    '''
    global alarms

    # check if the file is empty
    if os.stat('./alarmsdb/alarms.tsv').st_size == 0:
        # file is empty. Don't bother wasting resources to read an empty file
        return
    
    # clear the alarms dictionary to clear previous alarms (in case any alarms have been removed)
    alarms.clear()

    # read the file and store the times into the alarms dictionary
    with open('./alarmsdb/alarms.tsv', 'r') as f:
        for line in f.readlines():
            alarms[line.rstrip().split('\t')[0]] = line.rstrip().split('\t')[1]

if __name__ == '__main__':
    playsounds_script = None
    start_arduino_script = None
    sounds_script_pid = None

    while True:
        # start reading the alarms database
        read_db_file()

        #loop through each of the alarms
        for alarm in alarms.items():
            # if the alarm is equal to the current time, start the big boy stuff
            if alarm[1] + ':00' == get_acc_time():
                print("PY: Alarm is set! Starting alarm")

                # tell the arduino to start blinking
                start_arduino_script = subp.Popen("python3 ./alert-arduino".split(),\
                    stdout=subp.PIPE, stdin=subp.PIPE)
                # start the playsounds script
                playsounds_script = subp.Popen("python3 ./playsounds".split(),\
                    stdout=subp.PIPE, stdin=subp.PIPE)
                # write to the file that the alarm is on
                with open('./alarmsdb/alarm_status.txt', 'w') as f:
                    f.write('on')
                    f.close()
                # get the playsounds script PID to kill it later
                sounds_script_pid = playsounds_script.pid
                
                # wait until the user has stopped the alarm
                while True:
                    if open('./alarmsdb/alarm_status.txt', 'r').read() == 'off':
                        print("Alarm has been called off!")
                        break
                # kill the playsounds script
                os.kill(sounds_script_pid, signal.SIGTERM)

                # run a quick script to tell the arduino to stop
                subp.Popen('python3 ./kill-conn'.split(),\
                    stdout=subp.PIPE, stdin=subp.PIPE)
        # sleep for 160 milliseconds
        time.sleep(0.16)