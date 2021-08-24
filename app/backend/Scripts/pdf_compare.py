from sys import argv
import pdfplumber

# PDF_COMPARE
# Takes 2 PDF files and returns True if there is a difference in the files

class pdf():

    def get_content(self):
        file = self.file
        numberPages = self.numberPages
        content = []

        for page in range (numberPages):
            currentPage = file.pages[page]
            pageContent = currentPage.extract_text()
            content.append(pageContent)
            
        return content
    
    def __init__(self, filePath):
        with pdfplumber.open(filePath) as pdf:
            self.numberPages = len(pdf.pages)
            self.file = pdf
            self.content = self.get_content()


def compare_pdfs(original:pdf, test:pdf):
    if original.numberPages != test.numberPages:
        print("Not same number of pages")
    for page in range(original.numberPages-1):
        if original.content[page] != test.content[page]:
            print(f"Changes in page: {page+1}")


originalFile, newFile = [argv[1], argv[2]]
originalFile = pdf(originalFile)
newFile = pdf(newFile)
compare_pdfs(originalFile, newFile)