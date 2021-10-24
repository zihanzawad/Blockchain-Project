from pdf2image import convert_from_path, convert_from_bytes
from os import path, makedirs
from hashlib import sha256
import numpy as np


class Transformer():

    def pdf_as_images(inputPath: str):
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
    def numpy_splitter(imagesAsNumpy: list, chunks: int=18) -> list:
        chunkedImages = []
        for image in imagesAsNumpy:
            current_image = []
            chunked_image_row = np.array_split(image, chunks)
            for row in chunked_image_row:
                chunked_row = np.array_split(row, chunks, axis=1)
                current_image.append(chunked_row)
            chunkedImages.append(current_image)
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
            for chunk_row in page:
                row = []
                for chunk in chunk_row:
                    row.append(Transformer.encrypt_data(np.ascontiguousarray(chunk)))
                currentPage.append(row)
            encryptedPages.append(currentPage)
        return encryptedPages

    #converts bytes to array of SHA256 hash strings
    def bytes_to_hash_array(bytes:bytes):
        images = Transformer.bytes_to_images(bytes)
        pilArray = Transformer.PIL_to_Numpy(images)
        npArray = Transformer.numpy_splitter(pilArray)
        hashArray = Transformer.encrypt_document(npArray)
        return hashArray

    def images_to_hash_array(images:list):
        pilArray = Transformer.PIL_to_Numpy(images)
        npArray = Transformer.numpy_splitter(pilArray)
        hashArray = Transformer.encrypt_document(npArray)
        return hashArray

    #compares hash array lists
    def compare_document_hashes(original: list, toVerify: list):
        tamperedRegions = []
        if len(original) == len(toVerify):
            for pageNum in range(len(original)):
                for rowNum in range(len(original[pageNum])):
                    for chunkNum in range(len(original[pageNum][rowNum])):
                        if original[pageNum][rowNum][chunkNum] != toVerify[pageNum][rowNum][chunkNum]:
                            tamperedRegions.append([pageNum, rowNum, chunkNum])
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

PDF = Transformer.pdf_as_images('app/backend/Scripts/tests/pdf-test.pdf')
PDF = Transformer.PIL_to_Numpy(PDF)
chunkedPDF = Transformer.numpy_splitter(PDF)
hashArray = Transformer.encrypt_document(chunkedPDF)
print(len(hashArray[0][0]))