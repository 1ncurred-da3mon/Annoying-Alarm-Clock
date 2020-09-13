#!/usr/bin/python3

import subprocess as subp
import os

if __name__ == '__main__':
	procs = [ subp.getstatusoutput('python3 ./alert-arduino'), subp.getstatusoutput('python3 ./playsounds')]

