// src/pages/ProductsPage.jsx
// Inventory Catalog catalog manager. Manages items and categories.

import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Plus, Tags } from 'lucide-react';

// Components
import PageHeader from '../components/common/PageHeader';
import SearchBar from '../components/common/SearchBar';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import ProductDetail from '../components/products/ProductDetail';
import CategoryForm from '../components/products/CategoryForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const ProductsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

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

  const handleCreateCategory = async (catData) => {
    try {
      await productService.createCategory(catData);
      showToast('Product category added successfully.', 'success');
      setIsCatFormOpen(false);
      fetchResources();
    } catch (err) {
      showToast('Failed to add category.', 'error');
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

  // Filter products by search query
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
  });

  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  const categoryName = selectedProduct
    ? categories.find((c) => c.id === selectedProduct.categoryId)?.name
    : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Products Catalog"
        subtitle="Maintain catalogs of assemblies and raw materials."
        actions={
          <div className="flex items-center gap-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search catalog..." />
            {canEdit && (
              <>
                <button
                  onClick={() => setIsCatFormOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-sm transition-colors"
                >
                  <Tags className="w-4 h-4 text-slate-500" />
                  <span>Add Category</span>
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

      {/* Catalog List */}
      <ProductList
        products={filteredProducts}
        categories={categories}
        onEdit={handleEditClick}
        onDelete={setProductToDelete}
        onView={handleViewClick}
        loading={loading}
        userRole={user?.role}
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

      {/* Category Form Modal */}
      <Modal
        isOpen={isCatFormOpen}
        onClose={() => setIsCatFormOpen(false)}
        title="Add Product Category"
        size="sm"
      >
        <CategoryForm
          onSubmit={handleCreateCategory}
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
