from pydantic import BaseModel
from typing import Optional
from datetime import date

class EmployeeBase(BaseModel):
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    position: Optional[str]
    salary_basic: Optional[float] = 0.0

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeRead(EmployeeBase):
    id: int
    date_of_birth: Optional[date]

    class Config:
        orm_mode = True
