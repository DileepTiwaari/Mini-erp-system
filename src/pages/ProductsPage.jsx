// src/pages/ProductsPage.jsx
// 
// WHAT IT DOES:
// Serves as the Product Catalog inventory manager view.
// Aggregates search (by SKU/name) and multi-field filters (by Category, Procurement Type, and Status),
// maps role-based actions, and integrates popups for product details, categories management, and creation forms.
// 
// WHY IT IS REQUIRED:
// 1. Centralizes catalog administration: lets users search, create, update, and delete catalog entities.
// 2. Holds category CRUD callbacks, enabling full hierarchy management without dedicated paths.
// 3. Implements strict RBAC checks dynamically at the button layer.
// 
// WHEN IT IS USED:
// Loaded on navigating to the `/products` path endpoint.

import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Plus, Tags, Search, Filter } from 'lucide-react';
import { checkPermission, ACTIONS, MODULES } from '../permissions/permissions';

// Components
import PageHeader from '../components/common/PageHeader';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import ProductDetail from '../components/products/ProductDetail';
import CategoryForm from '../components/products/CategoryForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

/**
 * WHAT IT DOES: Page view displaying the list of catalog items and control panels.
 * WHY IT IS REQUIRED: Feeds users with search filters, tables, and CRUD popups.
 * WHEN IT IS USED: Rendered for the `/products` route.
 */
export const ProductsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // WHAT IT DOES: Catalog collections and active filtering query parameters.
  // WHY IT IS REQUIRED: Binds grid filters dynamically.
  // WHEN IT IS USED: Fetched on mount, queried on typing or category select.
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterProcurement, setFilterProcurement] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal display toggles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // WHAT IT DOES: Gathers catalog items from service layers.
  // WHY IT IS REQUIRED: Syncs visual tables with DB tables.
  // WHEN IT IS USED: Triggered on mount and after saving edits.
  const fetchResources = async () => {
    try {
      setLoading(true);
      const [prodsList, catsList] = await Promise.all([
        productService.getProducts(),
        productService.getCategories()
      ]);
      setProducts(prodsList);
      setCategories(catsList);
    } catch (err) {
      showToast('Failed to load catalog resources.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // WHAT IT DOES: Handles saving product addition or edit forms.
  // WHY IT IS REQUIRED: Forwards validated inputs to services.
  // WHEN IT IS USED: Fired on submit edit/create modals.
  const handleCreateOrUpdate = async (productData) => {
    try {
      if (selectedProduct) {
        // Edit mode
        await productService.updateProduct(selectedProduct.id, productData);
        showToast('Product updated successfully.', 'success');
      } else {
        // Create mode
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

  // WHAT IT DOES: Removes product item from database.
  // WHY IT IS REQUIRED: Permanent catalog deletion.
  // WHEN IT IS USED: Fired upon confirm warnings dialog.
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

  // WHAT IT DOES: Handles Category Creation or Updating.
  // WHY IT IS REQUIRED: Manages category lists.
  // WHEN IT IS USED: Fired on submitting the inline Category Form.
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

  // WHAT IT DOES: Deletes a category if not currently bound to any active items.
  // WHY IT IS REQUIRED: Enforces relational integrity before deletion.
  // WHEN IT IS USED: Fired on clicking trash bin on Category Form listing.
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

  // WHAT IT DOES: Reusable filtering logic parsing query parameters.
  // WHY IT IS REQUIRED: Evaluates multiple states (category, type, status) simultaneously.
  // WHEN IT IS USED: Computed during products render cycles.
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    const matchesCategory = !filterCategory || p.categoryId === filterCategory;
    const matchesProcurement = !filterProcurement || p.procurementType === filterProcurement;
    const matchesStatus = !filterStatus || p.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesProcurement && matchesStatus;
  });

  // RBAC checks for action button layouts
  const canCreate = user && checkPermission(user.role, MODULES.PRODUCTS, ACTIONS.CREATE);
  const categoryName = selectedProduct
    ? categories.find((c) => c.id === selectedProduct.categoryId)?.name
    : '';

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
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </>
            )}
          </div>
        }
      />

      {/* Filter and Search Bar Card (Professional ERP Spacing) */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              placeholder="Search by product name or SKU / code..."
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Procurement Type Filter */}
            <select
              value={filterProcurement}
              onChange={(e) => setFilterProcurement(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Procurement Types</option>
              <option value="PURCHASE">PURCHASE</option>
              <option value="MANUFACTURING">MANUFACTURING</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog List */}
      <ProductList
        products={filteredProducts}
        categories={categories}
        onEdit={handleEditClick}
        onDelete={setProductToDelete}
        onView={handleViewClick}
        loading={loading}
        user={user}
      />

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
