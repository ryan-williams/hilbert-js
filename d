#!/bin/sh

ctor_arg=
first_arg_is_tuple=$(echo "$1" | perl -ne "print if s/^([0-9]+,)*[0-9]+$/,/")
if [ "$first_arg_is_tuple" == "" ]; then
	ctor_arg="$1"
	#echo "ctor: $ctor_arg"
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
