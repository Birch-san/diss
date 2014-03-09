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
		if [ -f "$thefile" ]
		then
			thisCount=$(cat "$thefile" | grep "duration: " | sed s'/ duration: //')
			count="$count$thisCount	"
		else
			exit 1
		fi
	done
	
	echo "$count"
done

#echo "$count" | pbcopy