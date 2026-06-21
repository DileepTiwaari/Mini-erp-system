/**
 * PURPOSE:
 * Serves as the main catalog screen for managing ERP master products and categories.
 *
 * BUSINESS USE:
 * Acts as the master data control board. Business owners and inventory controllers can
 * search for products by name or SKU, filter by category/procurement/status, view details,
 * and execute CRUD operations with pagination controls.
 *
 * API USAGE:
 * - Reads product listings via `productService.getProducts()`.
 * - Reads categories via `productService.getCategories()`.
 * - Commits creations via `productService.createProduct()`.
 * - Commits updates via `productService.updateProduct()`.
 * - Commits deletions via `productService.deleteProduct()`.
 * - Manages categories via category service CRUD methods.
 *
 * LOGIC EXPLANATION:
 * - Uses `Promise.all` inside `useEffect` on page mount to load catalog listings concurrently.
 * - Computes multi-criteria filtering client-side.
 * - Manages page transitions using the `usePagination` state hook.
 * - Slices the filtered array dynamically (`filteredProducts.slice(start, end)`) to feed
 *   only the active page segment of 10 items to the table grid, rendering the `<Pagination />` control block.
 * - Evaluates uppercase security roles to determine button visibility.
 */

import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import usePagination from '../hooks/usePagination';
import { Plus, Tags, Search } from 'lucide-react';
import { checkPermission, ACTIONS, MODULES } from '../permissions/permissions';

// Components
import PageHeader from '../components/common/PageHeader';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import ProductDetail from '../components/products/ProductDetail';
import CategoryForm from '../components/products/CategoryForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Pagination from '../components/common/Pagination';
import ErrorState from '../components/common/ErrorState';

export const ProductsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Search & Filter state hooks
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterProcurement, setFilterProcurement] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Pagination hook
  const { currentPage, pageSize, setPage, resetPagination } = usePagination(10);

  // Modal toggles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch all product and category listings
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(false);
      const [prodsList, catsList] = await Promise.all([
        productService.getProducts(),
        productService.getCategories()
      ]);
      setProducts(Array.isArray(prodsList) ? prodsList : []);
      setCategories(Array.isArray(catsList) ? catsList : []);
    } catch (err) {
      console.warn('[ProductsPage] fetchResources failed:', err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Whenever query or filters change, reset pagination to page 1
  useEffect(() => {
    resetPagination();
  }, [searchQuery, filterCategory, filterProcurement, filterStatus, resetPagination]);

  // Saves product creations or updates
  const handleCreateOrUpdate = async (productData) => {
    try {
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, productData);
        showToast('Product updated successfully.', 'success');
      } else {
        await productService.createProduct(productData);
        showToast('Product registered successfully.', 'success');
      }
      setIsFormOpen(false);
      setSelectedProduct(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to save product details.', 'error');
    }
  };

  // Removes a product
  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await productService.deleteProduct(productToDelete.id);
      showToast('Product deleted successfully.', 'success');
      setProductToDelete(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to delete product.', 'error');
    }
  };

  // Saves category creations or updates
  const handleCreateOrUpdateCategory = async (catData) => {
    try {
      if (catData.id) {
        await productService.updateCategory(catData.id, catData);
        showToast('Category updated successfully.', 'success');
      } else {
        await productService.createCategory(catData);
        showToast('Category created successfully.', 'success');
      }
      fetchResources();
    } catch (err) {
      showToast('Failed to save category details.', 'error');
    }
  };

  // Removes a category division
  const handleDeleteCategory = async (catId) => {
    const linked = products.filter(p => p.categoryId === catId);
    if (linked.length > 0) {
      showToast('Cannot delete category. It is currently linked to active products.', 'warning');
      return;
    }
    try {
      await productService.deleteCategory(catId);
      showToast('Category deleted successfully.', 'success');
      fetchResources();
    } catch (err) {
      showToast('Failed to delete category.', 'error');
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleViewClick = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleAddClick = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  // Filters calculation
  const filteredProducts = (products || []).filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(q) || 
      (p.code || '').toLowerCase().includes(q);
    const matchesCategory = !filterCategory || String(p.categoryId) === String(filterCategory);
    const matchesProcurement = !filterProcurement || p.procurementType === filterProcurement;
    const matchesStatus = !filterStatus || p.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesProcurement && matchesStatus;
  });

  // Paginated segment selection logic
  const totalFiltered = filteredProducts.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  // RBAC checks for page commands
  const canCreate = user && checkPermission(user.role, MODULES.PRODUCTS, ACTIONS.CREATE);
  const categoryName = selectedProduct
    ? categories.find((c) => c.id === selectedProduct.categoryId)?.name
    : '';

  // Render check: Error state
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <ErrorState onRetry={fetchResources} title="Unable To Load Data" message="Unable to load product catalog database. Please verify connections and try again." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <PageHeader
        title="Products Catalog"
        subtitle="Maintain raw materials and finished assemblies."
        actions={
          <div className="flex items-center gap-2">
            {canCreate && (
              <>
                <button
                  onClick={() => setIsCatFormOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-sm transition-colors"
                >
                  <Tags className="w-4 h-4 text-slate-500" />
                  <span>Manage Categories</span>
                </button>
                <button
                  onClick={handleAddClick}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </>
            )}
          </div>
        }
      />

      {/* Filter and Search Bar Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by product name or SKU / code..."
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={filterProcurement}
              onChange={(e) => setFilterProcurement(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Procurement Types</option>
              <option value="PURCHASE">PURCHASE</option>
              <option value="MANUFACTURING">MANUFACTURING</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog List with Pagination rendering */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <ProductList
          products={paginatedProducts}
          categories={categories}
          onEdit={handleEditClick}
          onDelete={setProductToDelete}
          onView={handleViewClick}
          loading={loading}
          user={user}
        />
        
        {/* Pagination controls widget */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalFiltered}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedProduct ? 'Edit Catalog Product' : 'Add Catalog Product'}
        size="lg"
      >
        <ProductForm
          onSubmit={handleCreateOrUpdate}
          initialData={selectedProduct}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Category Management Modal */}
      <Modal
        isOpen={isCatFormOpen}
        onClose={() => setIsCatFormOpen(false)}
        title="Category Manager"
        size="md"
      >
        <CategoryForm
          categories={categories}
          onSubmit={handleCreateOrUpdateCategory}
          onDelete={handleDeleteCategory}
          onCancel={() => setIsCatFormOpen(false)}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Product Information Details"
        size="md"
      >
        <ProductDetail product={selectedProduct} categoryName={categoryName} />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Product?"
        message={`Are you sure you want to remove ${productToDelete?.name} (${productToDelete?.code})? This will delete it permanently from our active database.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default ProductsPage;
