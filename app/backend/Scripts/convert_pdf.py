from Transformer import Transformer as tf
import sys, os
import base64

#read in b64 string from files/fileName, I will pass in the file name as argv[1]

decode = base64.b64decode(sys.argv[1])
a = tf.bytes_to_hash_array(decode)
print(a)