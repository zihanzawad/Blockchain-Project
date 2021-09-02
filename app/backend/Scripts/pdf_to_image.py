from Transformer import Transformer as tf
from PIL import Image
import base64

# TEST FILE

inf = "/home/huy/Desktop/isml_stuff/cover7-converted.pdf"
outf = "/home/huy/Documents"

with open("/home/huy/Desktop/isml_stuff/cover7-converted.pdf", 'rb') as pdf_file:
    images = pdf_file.read()

a = tf.bytes_to_hash_array(images)
print(a)