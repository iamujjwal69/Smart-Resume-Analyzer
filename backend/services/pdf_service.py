import fitz  # PyMuPDF

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """Extracts text from a PDF file provided as bytes."""
    text = ""
    try:
        # Open the PDF from bytes
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""
