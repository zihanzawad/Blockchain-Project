from pdf2image import convert_from_path, convert_from_bytes
from os import path, makedirs
from hashlib import sha256
from PIL import Image
import numpy as np


class Transformer():

    def pdf_as_images(inputPath: str):
        pdfAsImages = convert_from_path(inputPath, poppler_path=r'C:\Program Files\poppler-21.10.0\Library\bin')
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
    def bytes_to_hash_array(inputPath:str):
        #images = Transformer.bytes_to_images(inputPath)
        images = Transformer.pdf_as_images(inputPath)
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


    def concatenate_images(im1: Image, im2: Image):
        concatenated_image = Image.new('RGB', (im1.width, im1.height + im2.height))
        concatenated_image.paste(im1, (0, 0))
        concatenated_image.paste(im2, (0, im1.height))
        return concatenated_image


    # Highlights tampered areas
    def visualise_tamper(pagesAsNumpy:list, tamperedRegions:list, v_chunks: int = 18, h_chunks: int = 18):

        pages = np.array(pagesAsNumpy,dtype=float)/255

        for region in tamperedRegions:
            page = region[0]
            v_chunk = region[1]
            h_chunk = region[2]
            v_lower = round(np.shape(pages[page])[0]*v_chunk/v_chunks)
            v_upper = round(np.shape(pages[page])[0]*(v_chunk+1)/v_chunks)
            h_lower = round(np.shape(pages[page])[1]*h_chunk/h_chunks)
            h_upper = round(np.shape(pages[page])[1]*(h_chunk+1)/h_chunks)
            pages[page,v_lower:v_upper, h_lower:h_upper, 1] *= 0.4
            pages[page,v_lower:v_upper, h_lower:h_upper, 2] *= 0.4

        output = Image.fromarray(pages[0])
        for page_num in range(1,len(pages)):
            next_image = Image.fromarray(pages[page_num])
            output = Transformer.concatenate_images(output, next_image)

        output.save("Scripts/files/tampered_regions.jpg")