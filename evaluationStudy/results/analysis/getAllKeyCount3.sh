directories="crosshairs flyouts tabbing"

	
# for every participant
for j in {2..13}
do
	rowCount=""

	# for every navtype
	for i in {0..7}
	do
			
		count=""
	
		# for every system
		for DIR in $directories
		do
			if [ "$i" -eq 0 ]
			then
				iter=""
			else
				iter=" ($i)"
			fi
			
			doc="document$iter.txt"
			#echo $doc
			
			thedir="../$j/$DIR"
			thefile="$thedir/$doc"
			thisCount=$(cat "$thefile" | grep "keyCount: " | sed s'/ keyCount: //')
			count="$count$thisCount	"
		done
			rowCount="$rowCount$count"
	
	done
		echo "$rowCount"
	
done

#echo "$count" | pbcopy