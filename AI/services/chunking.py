from langchain_text_splitters import RecursiveCharacterTextSplitter


def split_documents(documents):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        separators=[
            "\n\n",
            "\n",
            ". ",
            " ",
            "",
        ],
    )

    return splitter.split_documents(documents)


def add_chunk_metadata(chunks,lesson_id=None,filename=None,):


    if lesson_id is None and filename is None:
        raise ValueError( "Either lesson_id or filename must be provided." )

    for index, chunk in enumerate(chunks):

        metadata = dict(chunk.metadata)

        page = metadata.get("page")

        if page is not None:
            page = int(page) + 1

        if lesson_id is not None:

            metadata["lesson_id"] = str(lesson_id)

            metadata["source_type"] = "lesson"

            metadata["chunk_id"] = ( f"lesson-{lesson_id}-{index}")

        else:

            metadata["filename"] = str(filename)

            metadata["source_type"] = "pdf"

            metadata["chunk_id"] = (  f"pdf-{filename}-{index}" )

        if page is not None:
            metadata["page"] = page

        chunk.metadata = metadata

    return chunks