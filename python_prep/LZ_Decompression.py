import lzma as lz

comp = '7NjsjmHC2304D0x0533V65871R599dZISuruLI730519ZqgiJsukx02dx925TXxzf3946BFD'

b = bytearray(comp, 'utf-8')

uncomp = lz.decompress(b)

print(uncomp)
