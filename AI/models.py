from typing import Literal, Optional

from langchain_core.documents import Document
from pydantic import BaseModel


class LessonDocumentRequest(BaseModel):
    id: str
    title: str
    projectName: str

    departmentId: str
    functionId: str
    industryId: str

    valueProposition: str
    description: str

    imageUrl: Optional[str] = None
    personToContact: Optional[str] = None

    createdDate: Optional[str] = None
    modifiedDate: Optional[str] = None

    status: Literal["new", "update", "delete"]

    def to_document(self) -> Document:
        """
        Convert a KBM lesson into one LangChain Document.
        """

        content = f"""
Title:
{self.title}

Project Name:
{self.projectName}

Department ID:
{self.departmentId}

Function ID:
{self.functionId}

Industry ID:
{self.industryId}

Value Proposition:
{self.valueProposition}

Description:
{self.description}

Person To Contact:
{self.personToContact or ""}

Image URL:
{self.imageUrl or ""}

Created Date:
{self.createdDate or ""}

Modified Date:
{self.modifiedDate or ""}
""".strip()

        return Document(
            page_content=content,
            metadata={
                "lesson_id": str(self.id),
                "source_type": "lesson",
                "title": self.title,
            },
        )