if [ -z "$1" ]
then
	exit 1
fi

# for first file
filename=$(basename "$1")
dir=$(dirname "$1")

# find its number
detectednum=$(echo "$filename" | sed 's/document (\([0-9]*\)).txt/\1/')
# generate a dudname
dudname=$(echo "$filename" | sed 's/\(.txt\)/DUD\1/')

echo $dudname
mv "$1" "$dir/$dudname"

nextfilenum=$((detectednum+1))
nextfileshort=$(echo "$filename" | sed "s/(\([0-9]*\)).txt/($nextfilenum)/")
nextfilelong="$dir/$nextfileshort.txt"

echo "checking existence of: $nextfilelong"
while [ -f "$nextfilelong" ]
do
	decrementednum=$((nextfilenum-1))
	decrementedver=$(echo "$nextfileshort" | sed "s/(\([0-9]*\))/($decrementednum)/")
	decrementedverlong="$dir/$decrementedver.txt"
	
	echo "found file: $nextfilelong"
	echo "suggest changing to: $decrementedverlong"
	
	mv "$nextfilelong" "$decrementedverlong"
	
	nextfilenum=$((nextfilenum+1))
	nextfileshort=$(echo "$filename" | sed "s/(\([0-9]*\)).txt/($nextfilenum)/")
	nextfilelong="$dir/$nextfileshort.txt"
done

#decrementedval=$((detectednum-1))
#echo $decrementedval

#decrementedfile=$(echo "$filename" | sed "s/(\([0-9]*\)).txt/($decrementedval)/")
#echo $decrementedfile

#mv "$1" "$dir/$detectednum.txt"