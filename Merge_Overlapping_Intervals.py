def mergeIntervals(intervals):
	# Sort the array on the basis of start values of intervals.
	intervals.sort()
	stack = []
	# insert first interval into stack
	stack.append(intervals[0])
	for i in intervals[1:]:
		# Check for overlapping interval,
		# if interval overlap
		if stack[-1][0] <= i[0] <= stack[-1][-1]:
			stack[-1][-1] = max(stack[-1][-1], i[-1])
		else:
			stack.append(i)

	print("The Merged Intervals are :", end=" ")
	for i in range(len(stack)):
		print(stack[i], end=" ")


arr = [[14,15],[21,30],[8,13],[7,17],[6,16],[21,22],[24,34],[15,21],[19,23],[25,28],[10,19],[1,10],[19,21],[2,3],[3,12],[4,13],[24,28],[14,23]]
mergeIntervals(arr)
