import os
import shutil
from pathlib import Path
import uvicorn
from fastapi import FastAPI,File, HTTPException,UploadFile
from fastapi.middleware.cors import CORSMiddleware
from models import LessonDocumentRequest
from services.chunking import add_chunk_metadata, split_documents
from services.document_loader import load_pdf
from services.vector_store import delete_lesson_documents,search_documents, store_documents


BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
CHROMA_DIR = BASE_DIR / "chroma_db"
UPLOAD_DIR.mkdir( exist_ok=True)
CHROMA_DIR.mkdir(exist_ok=True)


app = FastAPI( title="KBM RAG Service",version="3.0.0",description=( "Retrieval service for KBM lessons " "and PDF documents." ),)



origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
]


app.add_middleware( CORSMiddleware,allow_origins=origins,allow_credentials=True,allow_methods=["*"],allow_headers=["*"],)



@app.get("/")
def root():

    return {
        "service": "KBM RAG Service",
        "status": "running",
        "version": "3.0.0",
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":

        raise HTTPException( status_code=400,detail="Only PDF files are allowed.", )

    if not file.filename:

        raise HTTPException( status_code=400,detail="Filename is required.",)

    filename = os.path.basename(file.filename)

    destination = UPLOAD_DIR / filename

    try:

        with destination.open("wb") as output:

            shutil.copyfileobj( file.file, output, )

    except Exception as exc:

        raise HTTPException(status_code=500, detail=( f"Could not save file: {exc}"),)

    return {
        "uploaded": True,
        "filename": filename,
        "message": ( "File uploaded successfully." ),
    }



@app.post("/process-file/{filename}")
def process_file(filename: str):
   

    safe_filename = os.path.basename(
        filename
    )

    if safe_filename != filename:

        raise HTTPException( status_code=400,detail="Invalid filename.", )

    pdf_path = ( UPLOAD_DIR / safe_filename)

    if not pdf_path.exists():

        raise HTTPException(status_code=404, detail="PDF file not found.",)

    try:

        documents = load_pdf(str(pdf_path))

        if not documents:

            raise HTTPException(status_code=400,detail="PDF contains no readable content.",)


        chunks = split_documents( documents)
        chunks = add_chunk_metadata( chunks, filename=safe_filename,)
        stored = store_documents(chunks)

        return {
            "filename": safe_filename,
            "status": "indexed",
            "total_pages": len(documents),
            "total_chunks": len(chunks),
            "stored_chunks": stored,
        }

    except HTTPException:

        raise

    except Exception as exc:

        raise HTTPException( status_code=500, detail=str(exc), )


@app.get("/process-batch-files")
def process_batch_files():

    pdf_files = sorted(
        [
            path
            for path in UPLOAD_DIR.iterdir()
            if path.is_file()
            and path.suffix.lower() == ".pdf"
        ]
    )

    if not pdf_files:

        return {
            "uploaded": False,
            "message": (
                "No PDF files to process."
            ),
            "result": {
                "total_processed": 0,
                "files": [],
            },
        }

    results = []

    for pdf_path in pdf_files:

        filename = pdf_path.name

        try:

            documents = load_pdf( str(pdf_path) )
            chunks = split_documents(   documents )

            chunks = add_chunk_metadata( chunks,  filename=filename,)
            stored = store_documents( chunks)

            results.append(
                {
                    "filename": filename,
                    "total_pages": len(
                        documents
                    ),
                    "total_chunks": len(
                        chunks
                    ),
                    "stored_chunks": stored,
                    "status": "indexed",
                }
            )

        except Exception as exc:

            results.append(
                {
                    "filename": filename,
                    "status": "failed",
                    "error": str(exc),
                }
            )

    return {
        "uploaded": True,
        "message": (
            "Files processed."
        ),
        "result": {
            "total_processed": len(
                results
            ),
            "files": results,
        },
    }


@app.post("/process-lesson")
def process_lesson(lesson: LessonDocumentRequest):


    lesson_id = str(lesson.id)

    if lesson.status == "delete":

        deleted_count = (
            delete_lesson_documents( lesson_id ) )

        return {
            "success": True,
            "status": "delete",
            "lesson_id": lesson_id,
            "chunks_deleted": deleted_count,
            "message": (
                "Lesson deleted from "
                "vector database."
            ),
        }

    if lesson.status == "update":

        delete_lesson_documents(  lesson_id )


    document = ( lesson.to_document())

    chunks = split_documents( [document])

    chunks = add_chunk_metadata(chunks,lesson_id=lesson_id,)

    stored_count = store_documents( chunks )

    return {
        "success": True,
        "status": lesson.status,
        "lesson_id": lesson_id,
        "chunks_stored": stored_count,
        "message": (
            "Lesson indexed successfully."
            if lesson.status == "new"
            else
            "Lesson updated successfully."
        ),
    }


@app.get("/search")
def search(query: str, k: int = 5,):

    query = query.strip()

    if not query:

        raise HTTPException(status_code=400, detail="Query cannot be empty.",)

    if k < 1 or k > 20:

        raise HTTPException( status_code=400, detail=("k must be between 1 and 20." ),)

    results = search_documents( query,  k=k, )

    formatted_results = []

    for document in results:

        formatted_results.append(
            {
                "content": document.page_content,
                "metadata": document.metadata,
            }
        )

    return {
        "query": query,
        "count": len( formatted_results ),
        "results": formatted_results,
    }



@app.get("/search-lesson/{lesson_id}")
def search_lesson( lesson_id: str, query: str,k: int = 5,):
   

    query = query.strip()

    if not query:

        raise HTTPException(  status_code=400, detail="Query cannot be empty.", )

    if k < 1 or k > 20:

        raise HTTPException(status_code=400, detail=( "k must be between 1 and 20." ),)

    results = search_documents(query,k=k,lesson_id=lesson_id,)

    formatted_results = []

    for document in results:

        formatted_results.append(
            {
                "content": document.page_content,
                "metadata": document.metadata,
            }
        )

    return {
        "lesson_id": lesson_id,
        "query": query,
        "count": len(formatted_results),
        "results": formatted_results,
    }


if __name__ == "__main__":
 uvicorn.run( app, host="127.0.0.1", port=8000, )