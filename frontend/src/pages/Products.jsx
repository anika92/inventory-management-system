import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Product Inventory</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4 border-b">SKU</th>
              <th className="p-4 border-b">Name</th>
              <th className="p-4 border-b">Price</th>
              <th className="p-4 border-b">Cost Price</th>
              <th className="p-4 border-b">Stock</th>
              <th className="p-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-slate-400">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono font-medium">{item.sku}</td>
                  <td className="p-4 font-semibold">{item.name}</td>
                  <td className="p-4">${item.price.toFixed(2)}</td>
                  <td className="p-4">${item.cost_price.toFixed(2)}</td>
                  <td className="p-4 font-medium">{item.stock_quantity}</td>
                  <td className="p-4">
                    {item.stock_quantity <= item.low_stock_threshold ? (
                      <span className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;