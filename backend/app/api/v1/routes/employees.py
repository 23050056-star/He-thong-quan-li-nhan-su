from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_employees():
    return {"message": "Get all employees"}

@router.post("/")
def create_employee():
    return {"message": "Create employee"}