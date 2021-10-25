from numpy import string_
from Transformer import Transformer as tf
import sys, os
import base64

a = tf.bytes_to_hash_array(str(sys.argv[1]))
print(a)