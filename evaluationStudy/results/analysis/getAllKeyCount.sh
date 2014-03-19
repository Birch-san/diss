directories="crosshairs flyouts tabbing"

	
# for every test
for i in {0..7}
do

	# for every study
	for j in {2..13}
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
			
		echo "$count"
	
	done
	
done

#echo "$count" | pbcopy