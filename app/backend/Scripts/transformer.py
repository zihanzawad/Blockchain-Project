from pdf2image import convert_from_path, convert_from_bytes
from os import path, makedirs
from hashlib import sha256
import numpy as np


class Transformer():

    #read pdf from file path and convert to jpegs
    def save_pdf_as_image(inputPath:str, outputPath:str):
        if not path.exists(outputPath):
            makedirs(outputPath)

        pdfAsImages = convert_from_path(inputPath)
        for pageNum, page in enumerate(pdfAsImages):
            fileName = outputPath + 'output' + str(pageNum)
            page.save(fileName, "JPEG")
        return pdfAsImages

    def pdf_as_image(inputPath: str):
        pdfAsImages = convert_from_path(inputPath)
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
    def encrypt_data(data:list):
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

    def images_to_hash_array(images:list):
        pilArray = Transformer.PIL_to_Numpy(images)
        npArray = Transformer.PDF_to_Numpy(pilArray)
        hashArray = Transformer.encrypt_document(npArray)
        return hashArray

    #compares hash array lists
    def compare_document_hashes(original: list, toVerify: list):
        tamperedRegions = []
        if len(original) == len(toVerify):
            for pageNum in range(len(original)):
                for chunkNum in range(original[pageNum]):
                    if original[chunkNum] != toVerify[chunkNum]:
                        tamperedRegions.append([pageNum, chunkNum])
            if bool(tamperedRegions):
                return tamperedRegions
        else:
            return 1
        return 0