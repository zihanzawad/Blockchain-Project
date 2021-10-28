from numpy import string_
from Transformer import Transformer as tf
import sys, os
import base64

fileName =sys.argv[1]

a = tf.bytes_to_hash_array("files/" + fileName)
print(a)