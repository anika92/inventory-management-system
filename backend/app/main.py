from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_db
from app.models import Product, Customer, Sale
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import Depends

# Import your modular routers
from app.routers import auth, products, customers, categories, sales

app = FastAPI(title="Inventory Management System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers with the prefix /api/v1
app.include_router(auth.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(customers.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")
app.include_router(sales.router, prefix="/api/v1")


@app.get("/api/v1/dashboard/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    total_customers = db.query(Customer).count()

    sales_agg = db.query(func.sum(Sale.total_amount), func.sum(Sale.total_cost)).first()
    total_revenue = sales_agg[0] if sales_agg[0] else 0.0
    total_cost = sales_agg[1] if sales_agg[1] else 0.0
    net_profit = total_revenue - total_cost

    low_stock_count = db.query(Product).filter(
        Product.stock_quantity <= Product.low_stock_threshold
    ).count()

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_revenue": total_revenue,
        "total_cost": total_cost,
        "net_profit": net_profit,
        "low_stock_count": low_stock_count
    }