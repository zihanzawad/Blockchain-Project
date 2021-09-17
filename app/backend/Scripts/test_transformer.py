from transformer import Transformer as tf
from pathlib import Path

def test_compare_document_hashes():
    pdfImages = tf.pdf_as_images('app/backend/Scripts/pdf-test.pdf')

    # Check same hasharray
    hasharray1 = tf.images_to_hash_array(pdfImages)
    hasharray2 = tf.images_to_hash_array(pdfImages)
    print(tf.compare_document_hashes(hasharray1, hasharray2))

    # Check different hasharrays
    hasharray2[0][1] = 'a'
    hasharray2[1][1] = 'b'
    print(tf.compare_document_hashes(hasharray1, hasharray2))

    # Check different size hasharrays
    hasharray2.append(['a'])
    print(tf.compare_document_hashes(hasharray1, hasharray2))


def test_visualise_tamper():
    pil = tf.pdf_as_images('app/backend/Scripts/pdf-test.pdf')
    npImage = tf.PIL_to_Numpy(pil)

    tamper = [[0,1],[0,2],[0,4],[1,5],[1,12]]
    tf.visualise_tamper(npImage, tamper)
    
