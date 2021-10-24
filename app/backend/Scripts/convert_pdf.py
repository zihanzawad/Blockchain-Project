from Transformer import Transformer as tf
import sys
import base64

decodedPDF = base64.b64decode(sys.argv[1])
hashArray = tf.bytes_to_hash_array(decodedPDF)
print(hashArray)