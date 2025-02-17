from pydantic import BaseModel
from typing import List

class StudentCreateOrUpdate(BaseModel):
    last_name: str | None = None
    first_name: str | None = None
    middle_name: str | None = None
    course: int | None = None
    group_name: str | None = None
    faculty: str | None = None

class StudentResponse(BaseModel):
    id: int
    last_name: str
    first_name: str
    middle_name: str | None = None
    course: int
    group_name: str
    faculty: str

    class Config:
        orm_mode = True

class StudentsResponse(BaseModel):
    students: List[StudentResponse]
    totalCount: int
