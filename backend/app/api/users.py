from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from typing import List, Optional
from bson import ObjectId
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import os

from app.models.schemas import User, UserCreate, UserUpdate, UserRole, Token, TokenData
from app.services.database import get_db

router = APIRouter()

# Configuration de la sécurité
SECRET_KEY = os.getenv("SECRET_KEY", "mlplatformsecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Utilitaires pour la gestion des mots de passe et des tokens
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/users/token")

# Fonction utilitaire pour convertir ObjectId en str
def serialize_object_id(obj_id):
    return str(obj_id)

def verify_password(plain_password, hashed_password):
    """Vérifie si le mot de passe en clair correspond au mot de passe haché."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Génère un hash du mot de passe."""
    return pwd_context.hash(password)

async def get_user(db, username: str):
    """Récupère un utilisateur par son nom d'utilisateur."""
    user = await db.users.find_one({"username": username})
    if user:
        user["_id"] = serialize_object_id(user["_id"])
    return user

async def authenticate_user(db, username: str, password: str):
    """Authentifie un utilisateur."""
    user = await get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Crée un token d'accès JWT."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db = Depends(get_db)):
    """Récupère l'utilisateur actuel à partir du token JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Identifiants invalides",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username, role=payload.get("role"))
    except JWTError:
        raise credentials_exception
    user = await get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    """Vérifie si l'utilisateur actuel est actif."""
    if not current_user["is_active"]:
        raise HTTPException(status_code=400, detail="Utilisateur inactif")
    return current_user

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_db)):
    """Endpoint pour obtenir un token d'accès."""
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Récupère les informations de l'utilisateur actuel."""
    return current_user

@router.get("/", response_model=List[User])
async def get_users(
    skip: int = 0, 
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_db)
):
    """
    Récupère la liste des utilisateurs.
    Nécessite des privilèges d'administrateur.
    """
    # Vérifier si l'utilisateur a les droits d'administrateur
    if current_user["role"] != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Opération non autorisée"
        )
    
    # Exécuter la requête
    cursor = db.users.find().skip(skip).limit(limit)
    users = await cursor.to_list(length=limit)
    
    # Convertir les ObjectId en str et supprimer les mots de passe hachés
    for user in users:
        user["_id"] = serialize_object_id(user["_id"])
        if "hashed_password" in user:
            del user["hashed_password"]
    
    return users

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_db)
):
    """
    Crée un nouvel utilisateur.
    Nécessite des privilèges d'administrateur.
    """
    # Vérifier si l'utilisateur a les droits d'administrateur
    if current_user["role"] != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Opération non autorisée"
        )
    
    # Vérifier si le nom d'utilisateur existe déjà
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce nom d'utilisateur existe déjà"
        )
    
    # Préparer les données de l'utilisateur
    user_dict = user_data.dict(exclude={"password"})
    user_dict["hashed_password"] = get_password_hash(user_data.password)
    user_dict["created_at"] = datetime.now()
    user_dict["updated_at"] = datetime.now()
    
    # Insérer l'utilisateur dans la base de données
    result = await db.users.insert_one(user_dict)
    user_id = serialize_object_id(result.inserted_id)
    
    # Récupérer l'utilisateur créé
    created_user = await db.users.find_one({"_id": ObjectId(user_id)})
    created_user["_id"] = user_id
    
    # Supprimer le mot de passe haché de la réponse
    if "hashed_password" in created_user:
        del created_user["hashed_password"]
    
    return created_user

@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_db)
):
    """
    Met à jour un utilisateur existant.
    Un utilisateur peut mettre à jour ses propres informations, mais seul un administrateur peut modifier le rôle.
    """
    # Vérifier si l'utilisateur existe
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    # Vérifier les permissions
    is_admin = current_user["role"] == UserRole.ADMIN
    is_self = str(current_user["_id"]) == user_id
    
    if not (is_admin or is_self):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Opération non autorisée"
        )
    
    # Si l'utilisateur n'est pas administrateur, il ne peut pas modifier le rôle
    if not is_admin and user_update.role is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour modifier le rôle"
        )
    
    # Préparer les données de mise à jour
    update_data = {k: v for k, v in user_update.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.now()
    
    # Mettre à jour l'utilisateur
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    # Récupérer l'utilisateur mis à jour
    updated_user = await db.users.find_one({"_id": ObjectId(user_id)})
    updated_user["_id"] = user_id
    
    # Supprimer le mot de passe haché de la réponse
    if "hashed_password" in updated_user:
        del updated_user["hashed_password"]
    
    return updated_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_active_user),
    db = Depends(get_db)
):
    """
    Supprime un utilisateur existant.
    Nécessite des privilèges d'administrateur.
    """
    # Vérifier si l'utilisateur a les droits d'administrateur
    if current_user["role"] != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Opération non autorisée"
        )
    
    # Vérifier si l'utilisateur existe
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    # Empêcher la suppression de son propre compte
    if str(current_user["_id"]) == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous ne pouvez pas supprimer votre propre compte"
        )
    
    # Supprimer l'utilisateur
    await db.users.delete_one({"_id": ObjectId(user_id)})
    
    return JSONResponse(status_code=204, content={})
