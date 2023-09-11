text = "TRASH ENTER CACHE LINUX TABLE"
indent = -2

base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

res = ""

for cc in text:
    if cc != " ":
        i = base.find(cc) + indent
        i = i%26
        res += base[i]
    else:
        res += cc

print(res)
