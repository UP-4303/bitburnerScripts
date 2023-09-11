bit = '0100001010111101'
bits = []
err = 0

for b in bit:
    bits.append(int(b))

for i in range(0, len(bits)):
    if bits[i]:
        err = err ^ i

print(err)
