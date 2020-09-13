#!/usr/bin/python3

import os       # check if the database is empty
import sys      # exit script with specific error code

if os.stat('./alarmsdb/alarms.tsv').st_size == 0:
    # file is empty
    sys.exit(1)
else:
    # file is not empty
    sys.exit(0)