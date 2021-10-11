from Transformer import Transformer as tf
import sys, os
import base64

decode = base64.b64decode(sys.argv[1])
a = tf.bytes_to_hash_array(decode)
print(a)