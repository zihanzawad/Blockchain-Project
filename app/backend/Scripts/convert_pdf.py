from numpy import string_
from Transformer import Transformer as tf
import sys, os
import base64

sliced = ""
fileName =sys.argv[1]
if fileName.endswith('\r\n') :
    sliced = fileName[0:len(fileName)-3]
print(sliced)

a = tf.bytes_to_hash_array("Scripts/files/" + sliced)
print(a)