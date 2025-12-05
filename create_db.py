# Thay đổi import cho đúng cấu trúc
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine
from app.models.base import Base
from app.models import user, employee

Base.metadata.create_all(bind=engine)
print("DB created")