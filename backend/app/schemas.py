from pydantic import BaseModel
from typing import Optional, List

class ProductCreate(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    price: float
    cost_price: float
    stock_quantity: int
    low_stock_threshold: int = 5
    category_id: int

class ProductResponse(ProductCreate):
    id: int
    class Config:
        orm_mode = True

class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    class Config:
        orm_mode = True

class CustomerCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class CustomerResponse(CustomerCreate):
    id: int
    class Config:
        orm_mode = True