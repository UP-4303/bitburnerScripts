myList = [5,7,-1,2,5,6,-2,7,6,0]
listOfSubLists = []
for i in range(len(myList)+1):
    for j in range(i+1, len(myList)+1):
        listOfSubLists.append(myList[i:j])
listOfAllSum = []
for i in listOfSubLists:
    listOfAllSum.append(sum(i))
max = -1
index = 0
for i in range(len(listOfAllSum)):
    if listOfAllSum[i]>max:
        max = listOfAllSum[i]
        index = i
print('List with maximum sum is: ', listOfSubLists[index])
print('Maximum sum is: ', max)
