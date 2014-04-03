directories="crosshairs flyouts tabbing"
systems=("Chibipoint (crosshairs ONLY)" "Chibipoint (crosshairs AND flyouts)" "Tabbing")
	
# for every test
for i in {0..7}
do

	# for every study
	for j in {2..13}
	do
			
		count=""
		
		sys=0
		
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
			
			printsys=${systems[sys]}
			sys=$((sys+1))
			
			thedir="../$j/$DIR"
			thefile="$thedir/$doc"
			thisCount=$(cat "$thefile" | grep "keyCount: " | sed s'/ keyCount: //')
			#count="$count$thisCount	"
			echo "$printsys	$thisCount"
		done
			
		#echo "$count"
	
	done
	
done

#echo "$count" | pbcopy