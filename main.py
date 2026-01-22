import uvicorn
import os
import shutil
import time
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from jose import jwt

# --- CONFIGURATION ---
DATABASE_URL = "sqlite:///./rasstube.db"
SECRET_KEY = "supersecret"
ALGORITHM = "HS256"
UPLOAD_DIR = "storage/videos"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- MODÈLES ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    videos = relationship("Video", back_populates="owner")

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    file_path = Column(String)
    views = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="videos")

# --- SCHEMAS ---
class VideoOut(BaseModel):
    id: int
    title: str
    file_path: str
    views: int
    owner_username: str
    created_at: datetime
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str

# --- APP ---
app = FastAPI()

# IMPORTANT : Correction pour que les autres puissent se connecter
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Autorise tous les appareils (amis, mobiles)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory="storage"), name="static")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

def get_current_user(token: str, db: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        user = db.query(User).filter(User.username == username).first()
        return user
    except: return None

# --- ENDPOINTS ---

@app.post("/api/login")
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_in.username).first()
    if not user:
        user = User(username=user_in.username)
        db.add(user)
        db.commit()
        db.refresh(user)
    token = jwt.encode({"sub": user.username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "username": user.username}

# CORRECTION : Récupération globale pour le réseau social
@app.get("/api/videos", response_model=List[VideoOut])
def get_all_videos(db: Session = Depends(get_db)):
    # On récupère TOUTES les vidéos de TOUS les utilisateurs, par date
    videos = db.query(Video).order_by(desc(Video.created_at)).all()
    
    results = []
    for v in videos:
        v_out = VideoOut.from_orm(v)
        # On s'assure que le nom de l'auteur est bien envoyé
        v_out.owner_username = v.owner.username if v.owner else "Anonyme"
        results.append(v_out)
    return results

@app.post("/api/videos")
def upload_video(
    title: str = Form(...),
    token: str = Form(...),
    fallback_url: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    if not user: raise HTTPException(401, "Non connecté")

    path = fallback_url
    if file:
        filename = f"{int(time.time())}_{file.filename}"
        local_path = os.path.join(UPLOAD_DIR, filename)
        with open(local_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        path = f"/static/videos/{filename}"

    new_video = Video(title=title, file_path=path, owner_id=user.id)
    db.add(new_video)
    db.commit()
    return {"status": "success"}

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    uvicorn.run(app, host="0.0.0.0", port=8000)
