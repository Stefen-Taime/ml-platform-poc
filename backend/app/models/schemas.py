from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ModelType(str, Enum):
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    CLUSTERING = "clustering"
    FORECASTING = "forecasting"
    RECOMMENDATION = "recommendation"
    CUSTOM = "custom"

class ModelFramework(str, Enum):
    SCIKIT_LEARN = "scikit-learn"
    TENSORFLOW = "tensorflow"
    PYTORCH = "pytorch"
    XGBOOST = "xgboost"
    R = "r"
    CUSTOM = "custom"

class ModelStatus(str, Enum):
    DRAFT = "draft"
    READY = "ready"
    DEPLOYED = "deployed"
    ARCHIVED = "archived"

class ModelBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: ModelType
    framework: ModelFramework
    version: str = "1.0.0"
    tags: List[str] = []
    parameters: Dict[str, Any] = {}
    metadata: Dict[str, Any] = {}

class ModelCreate(ModelBase):
    owner_id: str
    department: str
    region: str
    brand: Optional[str] = None

class ModelUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    tags: Optional[List[str]] = None
    parameters: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    status: Optional[ModelStatus] = None

class ModelInDB(ModelBase):
    id: str = Field(..., alias="_id")
    owner_id: str
    department: str
    region: str
    brand: Optional[str] = None
    status: ModelStatus = ModelStatus.DRAFT
    file_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True

class Model(ModelInDB):
    pass

class DeploymentStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class DeploymentBase(BaseModel):
    model_id: str
    name: str
    description: Optional[str] = None
    parameters: Dict[str, Any] = {}
    schedule: Optional[str] = None  # Format cron pour la planification

class DeploymentCreate(DeploymentBase):
    owner_id: str

class DeploymentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    schedule: Optional[str] = None
    status: Optional[DeploymentStatus] = None

class DeploymentInDB(DeploymentBase):
    id: str = Field(..., alias="_id")
    owner_id: str
    status: DeploymentStatus = DeploymentStatus.PENDING
    dag_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True

class Deployment(DeploymentInDB):
    pass

class ExecutionStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"

class ExecutionBase(BaseModel):
    deployment_id: str
    parameters: Dict[str, Any] = {}

class ExecutionCreate(ExecutionBase):
    owner_id: str

class ExecutionInDB(ExecutionBase):
    id: str = Field(..., alias="_id")
    owner_id: str
    model_id: str
    status: ExecutionStatus = ExecutionStatus.QUEUED
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    result_path: Optional[str] = None
    logs: List[str] = []
    created_at: datetime

    class Config:
        allow_population_by_field_name = True

class Execution(ExecutionInDB):
    pass

class UserRole(str, Enum):
    ADMIN = "admin"
    DATA_SCIENTIST = "data_scientist"
    BUSINESS_USER = "business_user"
    VIEWER = "viewer"

class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    department: Optional[str] = None
    region: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.VIEWER

class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    department: Optional[str] = None
    region: Optional[str] = None
    role: Optional[UserRole] = None

class UserInDB(UserBase):
    id: str = Field(..., alias="_id")
    role: UserRole
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True

class User(UserInDB):
    pass

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: str
    role: UserRole
