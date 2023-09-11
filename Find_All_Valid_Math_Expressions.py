# Python3 program to find all possible expression which
# evaluate to target

# Utility recursive method to generate all possible
# expressions
def getExprUtil(res, curExp, _input, target, pos, curVal, last):
	# true if whole input is processed with some
	# operators
	if (pos == len(_input)):
		# if current value is equal to target
		#then only add to final solution
		# if question is : all possible o/p then just
		#push_back without condition
		if (curVal == target):
			res.append(curExp)
		return
	

	# loop to put operator at all positions
	for i in range(pos,len(_input)):
		# ignoring case which start with 0 as they
		# are useless for evaluation
		if (i != pos and _input[pos] == '0'):
			break

		# take part of input from pos to i
		part = _input[pos: i + 1].strip()

		# take numeric value of part
		cur = int(part)

		# if pos is 0 then just send numeric value
		# for next recursion
		if (pos == 0):
			getExprUtil(res, curExp + part, _input,
					target, i + 1, cur, cur)


		# try all given binary operator for evaluation
		else:
			getExprUtil(res, curExp + "+" + part, _input,
					target, i + 1, curVal + cur, cur)
			getExprUtil(res, curExp + "-" + part, _input,
					target, i + 1, curVal - cur, -cur)
			getExprUtil(res, curExp + "*" + part, _input,
					target, i + 1, curVal - last + last * cur,
					last * cur)
		
	


# Below method returns all possible expression
# evaluating to target
def getExprs(_input, target):
	res=[]
	getExprUtil(res, "", _input, target, 0, 0, 0)
	return res


# method to print result
def printResult(res):
	for i in range(len(res)):
		print(res[i],end=" ")
	print()


# Driver code to test above methods
if __name__ == '__main__':
	_input = "76811"
	target = -22
	res = getExprs(_input, target)
	printResult(res)
