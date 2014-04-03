while read x
do
echo $x | sed $'s/\t/JO: /'
done