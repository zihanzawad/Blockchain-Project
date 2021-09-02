from pdf2image import convert_from_path
from PIL import Image
from os import path, makedirs
import numpy as np

class Transformer():

    def pdf_to_image(inputPath:str, outputPath:str):
        if not path.exists(outputPath):
            makedirs(outputPath)

        pdfAsImages = convert_from_path(inputPath)
        for pageNum, page in enumerate(pdfAsImages):
            fileName = outputPath + 'output' + str(pageNum)
            page.save(fileName, "JPEG")
        return pdfAsImages

    def PIL_to_Numpy(input:list):
        pagesAsNumpy = []
        for page in input:
            pageAsNumpy = np.asarray(page)
            pagesAsNumpy.append(pageAsNumpy)
        return pagesAsNumpy
    
    def PDF_to_Numpy(imagesAsNumpy: list, chunks: int=18) -> list:
        chunkedImages = []
        for image in imagesAsNumpy:
            chunked_image = np.array_split(image, chunks)
            chunkedImages.append(chunked_image)
        return chunkedImages