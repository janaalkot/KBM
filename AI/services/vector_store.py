from pathlib import Path
from typing import Optional
from langchain_chroma import Chroma
from services.embeddings import get_embedding_model


BASE_DIR = Path(__file__).resolve().parent.parent
CHROMA_PATH = str(BASE_DIR / "chroma_db")
COLLECTION_NAME = "kbm_documents"


def get_vector_store():


    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=get_embedding_model(),
        persist_directory=CHROMA_PATH,)


def store_documents(chunks):

    if not chunks:
        return 0

    vector_store = get_vector_store()

    ids = []

    for chunk in chunks:

        chunk_id = chunk.metadata.get("chunk_id")

        if not chunk_id:
            raise ValueError("Every chunk must contain a chunk_id.")

        ids.append(str(chunk_id))

    try:

        existing = vector_store._collection.get( ids=ids)

        existing_ids = existing.get( "ids", [] )

        if existing_ids:

            vector_store.delete( ids=existing_ids)

    except Exception:
        pass

    vector_store.add_documents(documents=chunks, ids=ids,)

    return len(chunks)


def search_documents(query: str,k: int = 5,lesson_id: Optional[str] = None,):

    vector_store = get_vector_store()

    if lesson_id:

        return vector_store.similarity_search(query, k=k, filter={"lesson_id": str(lesson_id) },)

    return vector_store.similarity_search( query, k=k,)


def delete_lesson_documents(lesson_id: str,):

    vector_store = get_vector_store()

    collection = vector_store._collection

    existing = collection.get(
        where={
            "lesson_id": str(lesson_id)
        }
    )

    ids = existing.get( "ids",  [])

    if not ids:
        return 0

    collection.delete( ids=ids )

    return len(ids)