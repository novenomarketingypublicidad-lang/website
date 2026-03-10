import sys
from pypdf import PdfReader

def extract_pdf_info(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        num_pages = len(reader.pages)
        print(f"Total pages: {num_pages}")
        
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text.strip():
                print(f"--- Page {i + 1} ---")
                print(text.strip())
                print()
    except Exception as e:
        print(f"Error reading PDF: {e}")

if __name__ == "__main__":
    extract_pdf_info(sys.argv[1])
