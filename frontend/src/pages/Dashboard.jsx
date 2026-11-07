import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import {
  Package, Users, DollarSign, AlertTriangle, TrendingUp,
  ShieldCheck, Plus, Edit, Trash2, ChevronUp, ChevronDown, X, Bell, Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    total_products: 0,
    total_customers: 0,
    total_sales: 0,
    low_stock_count: 0,
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    price: '',
    cost_price: '',
    stock_quantity: '',
    low_stock_threshold: 5,
    category_id: '',
  });

  useEffect(() => {
    fetchDashboardData();
    fetchCategories();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsRes, productsRes] = await Promise.all([
        API.get('/dashboard/metrics'),
        API.get('/products')
      ]);
      setMetrics(metricsRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  // Quick Stock Adjuster
  const handleStockAdjust = async (product, change) => {
    const updatedQuantity = Math.max(0, product.stock_quantity + change);
    try {
      await API.put(`/products/${product.id}`, {
        ...product,
        stock_quantity: updatedQuantity
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to adjust stock', err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      price: product.price,
      cost_price: product.cost_price,
      stock_quantity: product.stock_quantity,
      low_stock_threshold: product.low_stock_threshold,
      category_id: product.category_id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        fetchDashboardData();
      } catch (err) {
        console.error('Failed to delete product', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        cost_price: parseFloat(formData.cost_price),
        stock_quantity: parseInt(formData.stock_quantity),
        low_stock_threshold: parseInt(formData.low_stock_threshold),
        category_id: parseInt(formData.category_id),
      };

      if (editingProduct) {
        await API.put(`/products/${editingProduct.id}`, payload);
      } else {
        await API.post('/products', payload);
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to save product', err);
      alert('Error saving product. Check console details.');
    }
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      description: '',
      price: '',
      cost_price: '',
      stock_quantity: '',
      low_stock_threshold: 5,
      category_id: '',
    });
  };

  // Dummy monthly revenue dataset for the Bar Chart matching reference style
  const monthlyRevenueData = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 61000 },
    { month: 'Apr', amount: 48000 },
    { month: 'May', amount: 24000 }, // needs attention color
    { month: 'Jun', amount: 39000 },
    { month: 'Jul', amount: 43000 },
    { month: 'Aug', amount: 58000 },
    { month: 'Sep', amount: 0 },
    { month: 'Oct', amount: 0 },
    { month: 'Nov', amount: 0 },
    { month: 'Dec', amount: 0 },
  ];

  const topCards = [
    { title: 'Total Products', value: metrics.total_products, icon: Package, badge: '+4.2% vs last mo', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Customers', value: metrics.total_customers, icon: Users, badge: '+1.8% this week', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Total Revenue', value: `$${metrics.total_sales.toFixed(2)}`, icon: DollarSign, badge: '+12.5% target', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Low Stock Alerts', value: metrics.low_stock_count, icon: AlertTriangle, badge: 'Requires action', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Enterprise ERP Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Inventory Intelligence Hub</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time tracking of categories, stock limits, and financial revenue charts.</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-semibold shadow-lg transition-all self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {card.badge}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{loading ? '...' : card.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Layout Grid: Split View (Categories Grid & Right Side Alerts Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left 2 Columns: Category Performance Grid & Monthly Bar Chart */}
        <div className="lg:col-span-2 space-y-8">

          {/* Category Health Blocks (Similar to Student Attendance Grid in your screenshot) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Category Stock Health Grid</h3>
                <p className="text-sm text-slate-500">Live operational status across registered categories</p>
              </div>
              <div className="flex items-center space-x-4 text-xs font-semibold">
                <span className="flex items-center text-emerald-700"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span> Optimal</span>
                <span className="flex items-center text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span> Low Stock</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.length === 0 ? (
                <div className="col-span-4 p-4 text-center text-slate-400 text-sm">No categories found.</div>
              ) : (
                categories.map((cat) => {
                  return (
                    <div key={cat.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between hover:border-indigo-200 transition-all">
                      <span className="text-xs font-bold text-slate-500 uppercase truncate">{cat.name}</span>
                      <div className="my-3">
                        <span className="text-xl font-extrabold text-slate-800">Active</span>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-center">
                        Stable Stock
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Fee / Revenue Collection Bar Chart (Exactly like your reference image chart) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Revenue & Sales Collection</h3>
                <p className="text-sm text-slate-500">Target vs Realized monthly performance graph</p>
              </div>
              <div className="flex items-center space-x-3 text-xs font-medium text-slate-600">
                <span className="flex items-center"><span className="w-3 h-3 bg-emerald-500 rounded mr-1"></span> Collected: <b>$208,250</b></span>
                <span className="flex items-center"><span className="w-3 h-3 bg-indigo-500 rounded mr-1"></span> Target: <b>$245,000</b></span>
              </div>
            </div>

            {/* Recharts Bar Graph */}
            <div className="h-64 w-full pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {monthlyRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.amount < 30000 ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Pending Actions & System Alerts Sidebar */}
        <div className="space-y-6">

          {/* Pending Actions Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Pending Actions</h3>
              </div>
              <span className="text-xs font-semibold bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
                {metrics.low_stock_count} Alerts
              </span>
            </div>

            <div className="space-y-3">
              {products.filter(p => p.stock_quantity <= p.low_stock_threshold).length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-sm bg-slate-50 rounded-xl">
                  No urgent alerts. All stock levels are optimal!
                </div>
              ) : (
                products.filter(p => p.stock_quantity <= p.low_stock_threshold).slice(0, 4).map((item) => (
                  <div key={item.id} className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                      <p className="text-xs text-amber-800">Stock remaining: <b>{item.stock_quantity} units</b></p>
                    </div>
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Restock
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick System Events Widget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">System Logs</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-indigo-600 block">Today, 10:42 AM</span>
                <p className="text-slate-800 font-medium text-xs mt-0.5">Database schema synchronized successfully.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-emerald-600 block">Yesterday, 4:15 PM</span>
                <p className="text-slate-800 font-medium text-xs mt-0.5">Automated backup completed without errors.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="flex justify-between items-center bg-slate-50 px-6 py-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Category</label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.cost_price}
                    onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.low_stock_threshold}
                    onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
                >
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;