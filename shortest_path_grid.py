grid = [[0,1,0,0,0],
        [0,0,0,1,0]]

res = ""

x = 0
y = 0

max_x = len(grid[0]) 1
max_y = len(grid) 1

stuck = False
found = False

u = -2
r = -2
d = -2
l = -2

while !stuck and !found:
    if (y-1)>0:
        u=grid[y-1][x]
    else:
        u=-2
    if (x+1)<max_x:
        r=grid[y][x+1]
    else:
        r=-2
    if (y+1)<max_y:
        d=grid[y+1][x]
    else:
        d=-2
    if (x-1)>0:
        l=grid[y][x-1]
    else:
        l=-2

    
