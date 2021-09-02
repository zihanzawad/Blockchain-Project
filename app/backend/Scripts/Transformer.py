from pdf2image import convert_from_path, convert_from_bytes
from PIL import Image
from os import path, makedirs
import numpy as np
from hashlib import sha256

class Transformer():
    
    #read pdf from file path and convert to jpegs
    def pdf_to_image(inputPath:str, outputPath:str):
        if not path.exists(outputPath):
            makedirs(outputPath)

        pdfAsImages = convert_from_path(inputPath)
        for pageNum, page in enumerate(pdfAsImages):
            fileName = outputPath + 'output' + str(pageNum)
            page.save(fileName, "JPEG")
        return pdfAsImages
    
    #read pdf from byte input and convert to jpegs
    def bytes_to_images(bytes:bytes):
        pdfAsImages = convert_from_bytes(bytes)
        return pdfAsImages

    #convert PIL arrays to numpy arrays
    def PIL_to_Numpy(input:list):
        pagesAsNumpy = []
        for page in input:
            pageAsNumpy = np.asarray(page)
            pagesAsNumpy.append(pageAsNumpy)
        return pagesAsNumpy
    
    #separate a page into 18 separate chunks
    def PDF_to_Numpy(imagesAsNumpy: list, chunks: int=18) -> list:
        chunkedImages = []
        for image in imagesAsNumpy:
            chunked_image = np.array_split(image, chunks)
            chunkedImages.append(chunked_image)
        return chunkedImages

    #return SHA256 hash of input
    def encrypt_data(data):
        hash = sha256(data)
        return hash.hexdigest()

    #convert chunked numpy representation into array of SHA256 hashes
    def encrypt_document(input:list):
        encryptedPages = []
        for page in input:
            for chunk in page:
                encryptedPages.append(Transformer.encrypt_data(chunk))
        return encryptedPages

    #converts bytes to array of SHA256 hash strings
    def bytes_to_hash_array(bytes:bytes):
        images = Transformer.bytes_to_images(bytes)
        pilArray = Transformer.PIL_to_Numpy(images)
        npArray = Transformer.PDF_to_Numpy(pilArray)
        hashArray = Transformer.encrypt_document(npArray)
        return hashArray