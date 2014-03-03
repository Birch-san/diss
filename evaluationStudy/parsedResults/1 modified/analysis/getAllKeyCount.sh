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
			thisCount=$(cat "$thefile" | grep "keyCount: " | sed s'/ keyCount: //')
			if [ "$DIR" != "crosshairs" ]
			then
				# shady accounting on tabbing and flyouts. fix it here.
				thisCount=$((thisCount+1))
			fi
			count="$count$thisCount	"
		else
			exit 1
		fi
	done
	
	echo "$count"
done

#echo "$count" | pbcopy