if [ "$1" -eq 0 ]
then
	iter=""
else
	iter=" ($1)"
fi

doc="document$iter.txt"
echo $doc

echo ""

directories="crosshairs flyouts tabbing"

for DIR in $directories
do
	thedir="../$DIR"
	thefile="$thedir/$doc"
	echo "$DIR"
	cat "$thefile" | grep "page"
	cat "$thefile" | grep "href:"
	cat "$thefile" | grep "keyCount:"
	echo ""
done