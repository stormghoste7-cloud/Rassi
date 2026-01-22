# main.py
import uvicorn
import os
import shutil
import time
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Text, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from jose import JWTError, jwt
from passlib.context import CryptContext

# --- CONFIGURATION ---
DATABASE_URL = "sqlite:///./rasstube.db"
SECRET_KEY = "supersecret"
ALGORITHM = "HS256"
UPLOAD_DIR = "storage/videos"

# --- BASE DE DONNÉES ---
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- MODÈLES (Tables) ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    videos = relationship("Video", back_populates="owner")

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    file_path = Column(String) # URL ou chemin local
    views = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="videos")

# --- SCHEMAS (Validation) ---
class VideoOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    file_path: str
    views: int
    owner_username: str
    created_at: datetime
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str

# --- SÉCURITÉ ---
oauth2_scheme = None # Simplifié pour l'exemple

def create_access_token(data: dict):
    to_encode = data.copy()
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

def get_current_user(token: str, db: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None: raise HTTPException(401)
    except: raise HTTPException(401)
    user = db.query(User).filter(User.username == username).first()
    if not user: raise HTTPException(401)
    return user

# --- APPLICATION FASTAPI ---
app = FastAPI()

# Autoriser tout le monde (Mobile, Web, Localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dossiers statiques
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory="storage"), name="static")

# --- ENDPOINTS ---

@app.post("/api/login")
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    # Auto-inscription simplifiée
    user = db.query(User).filter(User.username == user_in.username).first()
    if not user:
        user = User(username=user_in.username)
        db.add(user)
        db.commit()
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "username": user.username}

@app.get("/api/videos", response_model=List[VideoOut])
def get_all_videos(db: Session = Depends(get_db)):
    # C'EST ICI LA CORRECTION : On récupère TOUTES les vidéos
    videos = db.query(Video).order_by(desc(Video.created_at)).all()
    
    results = []
    for v in videos:
        # On force le chargement du nom de l'utilisateur
        v_out = VideoOut.from_orm(v)
        v_out.owner_username = v.owner.username
        results.append(v_out)
    return results

@app.post("/api/videos")
def upload_video(
    title: str = Form(...),
    fallback_url: str = Form(None),
    token: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    path = fallback_url
    
    # Gestion fichier réel
    if file:
        filename = f"{int(time.time())}_{file.filename}"
        local_path = os.path.join(UPLOAD_DIR, filename)
        with open(local_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        path = f"/static/videos/{filename}" # Chemin relatif pour le frontend
    
    if not path:
        path = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

    new_video = Video(title=title, file_path=path, owner_id=user.id)
    db.add(new_video)
    db.commit()
    return {"status": "ok"}

# --- AUTO-SEED (Remplissage automatique si vide) ---
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    if db.query(Video).count() == 0:
        print("--- BASE VIDE : CRÉATION DE DONNÉES DE TEST ---")
        u1 = User(username="Squeezie_Test")
        u2 = User(username="Amixem_Test")
        db.add_all([u1, u2])
        db.commit()
        
        v1 = Video(title="Vlog vacances", file_path="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", owner_id=u1.id, views=120)
        v2 = Video(title="Tuto Python", file_path="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", owner_id=u2.id, views=5000)
        v3 = Video(title="Mes chats", file_path="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", owner_id=u1.id, views=10)
        
        db.add_all([v1, v2, v3])
        db.commit()
        print("--- DONNÉES AJOUTÉES AVEC SUCCÈS ---")
    db.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
