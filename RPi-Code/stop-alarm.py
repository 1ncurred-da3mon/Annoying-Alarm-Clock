#!/usr/bin/python3
if __name__ == '__main__':
    # write to the alarm_status.txt 'off' when the alarm is being turned off
    with open('./alarmsdb/alarm_status.txt', 'w') as f:
        f.write('off')
        f.close()