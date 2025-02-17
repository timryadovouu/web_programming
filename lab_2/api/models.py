from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    last_name = Column(String, index=True)
    first_name = Column(String, index=True)
    middle_name = Column(String, index=True, nullable=True)
    course = Column(Integer, index=True)
    group_name = Column(String, index=True)
    faculty = Column(String, index=True)
