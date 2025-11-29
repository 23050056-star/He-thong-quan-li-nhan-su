backend/create_db.py
from app.db.session import engine
from app.models.base import Base
import app.models.user
import app.models.employee

Base.metadata.create_all(bind=engine)
print("DB created")
