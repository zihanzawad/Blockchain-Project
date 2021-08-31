from transformer import transformer as tf
from PIL import Image

# TEST FILE

inf = "/home/zihan/projects/Blockchain-Project/app/backend/Scripts/pdf-test.pdf"
outf = "~/Documents"

a = tf.pdf_to_image(inf, outf)
b = tf.PIL_to_Numpy(a)
c = tf.PDF_to_Numpy(b)
im = Image.fromarray(b[1])
im.save('1.png')