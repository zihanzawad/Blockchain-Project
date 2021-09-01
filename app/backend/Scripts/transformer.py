from pdf2image import convert_from_path
from PIL import Image
from os import path, makedirs
import numpy as np

class transformer():

    def pdf_to_image(input_path:str, output_path:str):
        if not path.exists(output_path):
            makedirs(output_path)

        pdf_as_images = convert_from_path(input_path)
        for page_num, page in enumerate(pdf_as_images):
            file_name = output_path + 'output' + str(page_num)
            page.save(file_name, "JPEG")
        return pdf_as_images

    def PIL_to_Numpy(input:list):
        pages_as_numpy = []
        for page in input:
            page_as_numpy = np.asarray(page)
            pages_as_numpy.append(page_as_numpy)
        return pages_as_numpy
    
    def PDF_to_Numpy(images_as_numpy: list, chunks: int=18) -> list:
        chunked_images = []
        for image in images_as_numpy:
            chunked_image = np.array_split(image, chunks)
            chunked_images.append(chunked_image)
        return chunked_images