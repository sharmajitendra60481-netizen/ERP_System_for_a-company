'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import { Plus, Package, Trash2 } from 'lucide-react'

export default function InventoryPage() {
  const { user: currentUser } = useAuthStore()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ sku: '', name: '', packageSize: '15L Tin', unitPrice: 1850, currentStock: 100 })

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const loadData = async () => {
    setLoading(true)
    try {
      const pData = await apiFetch<any[]>('/inventory/products').catch(() => [])
      setProducts(pData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiFetch('/inventory/products', {
        method: 'POST',
        body: JSON.stringify({
          ...newProduct,
          unitPrice: Number(newProduct.unitPrice),
          currentStock: Number(newProduct.currentStock),
        }),
      })
      setShowAddProduct(false)
      setNewProduct({ sku: '', name: '', packageSize: '15L Tin', unitPrice: 1850, currentStock: 100 })
      loadData()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      await apiFetch(`/inventory/products/${productToDelete.id}`, { method: 'DELETE' })
      setProductToDelete(null)
      loadData()
    } catch (err: any) {
      alert(err.message || 'Failed to delete product SKU')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory & Finished Goods</h1>
          <p className="text-slate-500 text-sm">Track packaged oil stock, warehouse bin locations, and SKU stock levels.</p>
        </div>
        <button
          onClick={() => setShowAddProduct(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" /> Add Finished Product
        </button>
      </div>

      {/* Finished Goods Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-semibold text-slate-800 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" /> Finished Goods Catalog
        </div>
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading finished goods...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No finished goods found. Click "Add Finished Product" to create your stock SKUs.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Package Size</th>
                <th className="px-6 py-3">Unit Price (₹)</th>
                <th className="px-6 py-3">Current Stock</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">{p.sku}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                  <td className="px-6 py-4 text-slate-600">{p.packageSize}</td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">₹{p.unitPrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700">
                      {p.currentStock.toLocaleString()} Units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isSuperAdmin && (
                      <button
                        onClick={() => setProductToDelete(p)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg transition"
                        title="Delete product SKU"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Add Product */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Add Finished Product SKU</h2>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">SKU Code</label>
                <input
                  required
                  placeholder="e.g. OIL-TIN-15L"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Product Name</label>
                <input
                  required
                  placeholder="e.g. Pure Refined Soyabean Oil"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Package Size</label>
                <select
                  value={newProduct.packageSize}
                  onChange={(e) => setNewProduct({ ...newProduct, packageSize: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  <option value="1L Pouch">1L Pouch</option>
                  <option value="5L Can">5L Can</option>
                  <option value="15L Tin">15L Tin</option>
                  <option value="200L Drum">200L Drum</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Unit Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.unitPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, unitPrice: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProduct.currentStock}
                    onChange={(e) => setNewProduct({ ...newProduct, currentStock: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Save Product SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Product SKU Deletion */}
      <ConfirmDeleteModal
        isOpen={!!productToDelete}
        title="Delete Finished Product SKU"
        description="Do you really want to delete this product SKU record from the catalog?"
        itemName={productToDelete ? `${productToDelete.name} (${productToDelete.sku})` : undefined}
        confirmLabel="Yes, Delete Product SKU"
        isDeleting={isDeleting}
        onConfirm={handleDeleteProduct}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  )
}
