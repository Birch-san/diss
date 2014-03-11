for i in {0..10}
do
	if [ "$i" -eq 0 ]
	then
		iter=""
	else
		iter=" ($i)"
	fi
	
	doc="document$iter.txt"
	#echo $doc
	
	directories="crosshairs flyouts tabbing"
	
	count=""
	
	for DIR in $directories
	do
		thedir="../$DIR"
		thefile="$thedir/$doc"
		thisCount=$(cat "$thefile" | grep "keyCount: " | sed s'/ keyCount: //')
		count="$count$thisCount	"
	done
	
	echo "$count"
done

#echo "$count" | pbcopy