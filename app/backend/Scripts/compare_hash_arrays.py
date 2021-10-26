from Transformer import Transformer as tf
import sys, os
import base64

original = sys.argv[1]
tampered = sys.argv[2]
newDoc = "Scripts/files/" + str(sys.argv[3])

#process uploaded doc as numpy array
pilImages= tf.pdf_as_images(newDoc)
pagesAsNumpy = tf.PIL_to_Numpy(pilImages)

#run tamper check and print result
isTampered = tf.compare_document_hashes(original, tampered)
if(isinstance(isTampered, list)):
    tf.visualise_tamper(isTampered, pagesAsNumpy)
else:
    print(isTampered)