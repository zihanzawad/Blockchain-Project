from transformer import transformer as tf
from PIL import Image

# TEST FILE

inf = "/home/huy/Desktop/isml_stuff/cover7-converted.pdf"
outf = "/home/huy/Documents"

a = tf.pdf_to_image(inf, outf)
b = tf.PIL_to_Numpy(a)
c = tf.PDF_to_Numpy(b)
im = Image.fromarray(b[0])
im.save('1.png')