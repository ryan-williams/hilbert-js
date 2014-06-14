#!/bin/sh

ctor_arg=
echo $1 | grep -q ","
if [ $? -gt 0 ]; then
	ctor_arg="$1"
	shift
fi

dim=$(echo "$1" | tr "," "\n" | wc -l | tr -d ' ')
if [ $dim -ne 2 -a $dim -ne 3 ]; then
	echo "Invalid number of commas in arg: $1"
	exit 1
fi

for arg in $@; do
	node -p -e "var h = new (require('./hilbert').Hilbert${dim}d)($ctor_arg); h.d($arg)"
done
