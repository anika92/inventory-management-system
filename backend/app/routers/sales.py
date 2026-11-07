from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Product, Sale, SaleItem
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/sales", tags=["Sales"])

class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int

class SaleCreate(BaseModel):
    customer_id: Optional[int] = None
    items: List[SaleItemCreate]

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_sale(sale_data: SaleCreate, db: Session = Depends(get_db)):
    total_amount = 0.0
    total_cost = 0.0
    sale_items_to_save = []

    for item in sale_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")
        if product.stock_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")

        product.stock_quantity -= item.quantity
        item_revenue = product.price * item.quantity
        item_cost = product.cost_price * item.quantity

        total_amount += item_revenue
        total_cost += item_cost

        sale_items_to_save.append({
            "product_id": product.id,
            "quantity": item.quantity,
            "unit_price": product.price,
            "unit_cost": product.cost_price
        })

    new_sale = Sale(
        customer_id=sale_data.customer_id,
        total_amount=total_amount,
        total_cost=total_cost
    )
    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    for s_item in sale_items_to_save:
        db_sale_item = SaleItem(sale_id=new_sale.id, **s_item)
        db.add(db_sale_item)
    db.commit()

    return {"message": "Sale recorded successfully", "sale_id": new_sale.id, "total_revenue": total_amount}