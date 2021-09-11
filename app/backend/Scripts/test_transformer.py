from transformer import Transformer as tf
from pathlib import Path

# TEST FILE

inputFile = "app/backend/Scripts/pdf-test.pdf"
tempLocation = "/home/huy/Documents"

with open("/home/huy/Desktop/isml_stuff/cover7-converted.pdf", 'rb') as pdf_file:
    images = pdf_file.read()

a = tf.bytes_to_hash_array(images)
print(a)