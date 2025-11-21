from sqlalchemy import Column, Integer, String, Date, Float, Text, ForeignKey
from app.models.base import Base

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String, nullable=True)
    position = Column(String, nullable=True)
    salary_basic = Column(Float, default=0.0)
    date_of_birth = Column(Date, nullable=True)
    address = Column(Text, nullable=True)
    # thêm trường cần thiết khác
