from fastapi import FastAPI, Depends, HTTPException, status, Request, Query
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session, joinedload
import logging
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, get_db
from models import Student
from typing import List, Optional
from schemas import StudentResponse, StudentCreateOrUpdate, StudentsResponse

# create app
app = FastAPI()

# create database tables
Base.metadata.create_all(bind=engine)

# create logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================================== STUDENT LOGIC =====================================

@app.get("/students", response_model=StudentsResponse)
def read_students(
    db: Session = Depends(get_db),
    skip: int = Query(0, description="Number of records to skip"),
    limit: int = Query(None, description="Maximum number of records to return")):

    students = db.query(Student).order_by(Student.id).offset(skip).limit(limit).all()
    total_count = db.query(Student).count()

    return {"students": students, "totalCount": total_count}

@app.post("/student/create")
def create_student(student: StudentCreateOrUpdate, db: Session = Depends(get_db)):
    middle_name = student.middle_name if student.middle_name else None  # None or str
    logger.info(f"middle_name: {middle_name}")
    # check if student already exists
    db_student = db.query(Student).filter(
        Student.last_name == student.last_name,
        Student.first_name == student.first_name,
        Student.middle_name == middle_name, 
        Student.course == student.course,
        Student.group_name == student.group_name,
        Student.faculty == student.faculty
    ).first()

    if db_student:
        raise HTTPException(status_code=400, detail="Student already exists")
    
    new_student = Student(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return {"message": "Student added successfully", "student": new_student}

@app.delete("/student/delete/{student_id}")
def delete_chat_room(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # delete student from database
    db.delete(student)
    db.commit()
    return {"message": f"Student (ID: {student_id}) deleted"}

@app.patch("/student/update/{student_id}")
def update_student(student_id: int, student_update: StudentCreateOrUpdate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # update fields and check if there is any new filed
    changes_flag = False
    for key, value in student_update.dict(exclude_unset=True).items():
        if getattr(student, key) != value:
            changes_flag = True
            setattr(student, key, value)

    if not changes_flag:
        raise HTTPException(status_code=404, detail="Student hasn't changed")

    db.commit()
    db.refresh(student)
    return {"message": f"Student (ID: {student_id}) updated"}


@app.get("/students/search", response_model=StudentsResponse)
def search_students(
    request: Request,
    db: Session = Depends(get_db)
    ):

    filters = []
    logger.info(f"parameters: {request.query_params.items()}")
    for field, value in request.query_params.items():
        if field in ["skip", "limit"]:
            continue
        if field == "middle_name":
            if value == "null":
                filters.append(Student.middle_name.is_(None))
            else:
                filters.append(getattr(Student, field).ilike(f"%{value}%"))
        elif hasattr(Student, field):
            column = getattr(Student, field)
            if column.type.python_type == int:  
                try:
                    int_value = int(value)  
                    filters.append(column == int_value)  
                except ValueError:
                    raise HTTPException(status_code=400, detail=f"Invalid value for field {field}: {value}. Must be an integer.")
            else:
                filters.append(column.ilike(f"%{value}%"))
        else:
            raise HTTPException(status_code=400, detail=f"Invalid search field: {field}")
        
    totalCount = db.query(Student).filter(*filters).count() if filters else db.query(Student).count()
    skip = int(request.query_params.get('skip', 0))
    limit = int(request.query_params.get('limit', totalCount))
    
    
    if filters:
        # students = db.query(Student).filter(*filters).all() 
        students = db.query(Student).order_by(Student.id).filter(*filters).offset(skip).limit(limit).all()
    else:
        # students = []
        students = db.query(Student).order_by(Student.id).offset(skip).limit(limit).all()

    if not students:
        raise HTTPException(status_code=404, detail="No students found")
    
    # return students
    return {"students": students, "totalCount": totalCount}
