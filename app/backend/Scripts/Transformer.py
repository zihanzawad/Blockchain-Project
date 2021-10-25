from pdf2image import convert_from_path, convert_from_bytes
from os import path, makedirs
from hashlib import sha256
import numpy as np
import sys
import base64


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

    def pdf_as_images(inputPath: str):
        pdfAsImages = convert_from_path(inputPath)
        return pdfAsImages

    #read pdf from byte input and convert to jpegs
    def bytes_to_images(inputpath:str):
        bytes = inputpath.encode()
        #pdfAsImages = convert_from_bytes(bytes,poppler_path=r'C:\Program Files\poppler-21.10.0\Library\bin')
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
            currentPage = []
            for chunk in page:
                currentPage.append(Transformer.encrypt_data(chunk))
            encryptedPages.append(currentPage)
        return encryptedPages

    #converts bytes to array of SHA256 hash strings
    def bytes_to_hash_array(inputPath:str):
        #images = Transformer.bytes_to_images(inputPath)
        images = Transformer.pdf_as_images(inputPath)
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
                for chunkNum in range(len(original[pageNum])):
                    if original[pageNum][chunkNum] != toVerify[pageNum][chunkNum]:
                        tamperedRegions.append([pageNum, chunkNum])
            if bool(tamperedRegions):
                return tamperedRegions
        else:
            return 1
        return 0

    # Highlights tampered areas
    def visualise_tamper(pagesAsNumpy:list, tamperedRegions:list, chunks: int = 18):

        pages = np.array(pagesAsNumpy,dtype=float)/255

        for region in tamperedRegions:
            page = region[0]
            chunk = region[1]
            lower = round(np.shape(pages[page])[0]*chunk/chunks)
            upper = round(np.shape(pages[page])[0]*(chunk+1)/chunks)
            pages[page,lower:upper,:,1] *= 0.4
            pages[page,lower:upper,:,2] *= 0.4

        for i in range(len(pages)):
            print(pages[0])

        #imshow(pages[0])