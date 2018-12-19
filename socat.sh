#! /bin/sh
# source: daemon.sh
# Copyright Gerhard Rieger 2001
# Published under the GNU General Public License V.2, see file COPYING

# This script assumes that you create group daemon1 and user daemon1 before.
# they need only the right to exist (no login etc.)

# Note: this pid file mechanism is not robust!

# You will adapt these variables
INIF=10.134.68.150
OUTIF=10.134.68.149
TARGET=shell.kungfulinux.com
INPORT=1025
DSTPORT=1025
#
INOPTS="fork"
OUTOPTS=
PIDFILE=/var/run/socat-$INPORT.pid
OPTS="-d -d -lm"        # notice to stderr, then to syslog
SOCAT=/usr/local/bin/socat

if [ "$1" = "start" -o -z "$1" ]; then

    $SOCAT $OPTS tcp-l:$INPORT,bind=$INIF,$INOPTS tcp:$TARGET:$DSTPORT,bind=$OUTIF,$OUTOPTS </dev/null &
    echo $! >$PIDFILE

elif [ "$1" = "stop" ]; then

    /bin/kill $(/bin/cat $PIDFILE)
fi
