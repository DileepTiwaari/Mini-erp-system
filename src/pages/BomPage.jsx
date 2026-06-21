// src/pages/BomPage.jsx
// Bill of Materials (BOM) management. Configures materials recipes and routing.

import React, { useState, useEffect } from 'react';
import manufacturingService from '../services/manufacturingService';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Plus, Settings } from 'lucide-react';

// Components
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import SearchBar from '../components/common/SearchBar';
import BomList from '../components/bom/BomList';
import BomForm from '../components/bom/BomForm';
import ComponentEditor from '../components/bom/ComponentEditor';
import OperationEditor from '../components/bom/OperationEditor';
import WorkCenterForm from '../components/bom/WorkCenterForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const BomPage = () => {
  const { showToast } = useToast();

  const [boms, setBoms] = useState([]);
  const [products, setProducts] = useState([]);
  const [workCenters, setWorkCenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isWcFormOpen, setIsWcFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBom, setSelectedBom] = useState(null);
  const [bomToDelete, setBomToDelete] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(false);
      const [bomsList, prodsList, wcsList] = await Promise.all([
        manufacturingService.getBoms(),
        productService.getProducts(),
        manufacturingService.getWorkCenters()
      ]);
      setBoms(Array.isArray(bomsList) ? bomsList : []);
      setProducts(Array.isArray(prodsList) ? prodsList : []);
      setWorkCenters(Array.isArray(wcsList) ? wcsList : []);
    } catch (err) {
      console.warn('[BomPage] fetch failed:', err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreateOrUpdate = async (bomData) => {
    try {
      if (selectedBom) {
        await manufacturingService.updateBom(selectedBom.id, bomData);
        showToast('Bill of Materials recipe updated.', 'success');
      } else {
        await manufacturingService.createBom(bomData);
        showToast('New Bill of Materials configured.', 'success');
      }
      setIsFormOpen(false);
      setSelectedBom(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to save BOM details.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!bomToDelete) return;
    try {
      await manufacturingService.deleteBom(bomToDelete.id);
      showToast('BOM recipe deleted.', 'success');
      setBomToDelete(null);
      fetchResources();
    } catch (err) {
      showToast('Failed to delete BOM.', 'error');
    }
  };

  const handleCreateWorkCenter = async (wcData) => {
    try {
      await manufacturingService.createWorkCenter(wcData);
      showToast('Work Center station configured successfully.', 'success');
      setIsWcFormOpen(false);
      fetchResources();
    } catch (err) {
      showToast('Failed to add Work Center.', 'error');
    }
  };

  const handleEditClick = (bom) => {
    setSelectedBom(bom);
    setIsFormOpen(true);
  };

  const handleViewClick = (bom) => {
    setSelectedBom(bom);
    setIsDetailOpen(true);
  };

  const handleAddClick = () => {
    setSelectedBom(null);
    setIsFormOpen(true);
  };

  const filteredBoms = (boms || []).filter((b) => {
    const q = searchQuery.toLowerCase();
    const prod = (products || []).find(p => p.id === b.productId);
    const prodName = prod ? (prod.name || '').toLowerCase() : '';
    return (b.name || '').toLowerCase().includes(q) || prodName.includes(q);
  });

  // Render Check: Error state — uses standardised ErrorState component
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ErrorState
          title="Failed to Load BOM Data"
          message="Something went wrong while loading bills of materials and work center configurations. Please try again."
          onRetry={fetchResources}
        />
      </div>
    );
  }

  // Render Check: Loading state — uses standardised Loader component
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" label="Loading manufacturing recipes..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Bill of Materials"
        isDemo={true}
        subtitle="Define materials consumption recipes and route templates for assembly manufacturing."
        actions={
          <div className="flex items-center gap-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search recipes..." />
            <button
              onClick={() => setIsWcFormOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-sm transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Add Station</span>
            </button>
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Configure BOM</span>
            </button>
          </div>
        }
      />

      {/* Lists */}
      <BomList
        boms={filteredBoms}
        products={products}
        onEdit={handleEditClick}
        onDelete={setBomToDelete}
        onView={handleViewClick}
        loading={loading}
      />

      {/* BOM Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedBom ? 'Edit BOM recipe' : 'Configure BOM recipe'}
        size="lg"
      >
        <BomForm
          onSubmit={handleCreateOrUpdate}
          initialData={selectedBom}
          workCenters={workCenters}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Work Center Form Modal */}
      <Modal
        isOpen={isWcFormOpen}
        onClose={() => setIsWcFormOpen(false)}
        title="Configure Work Center Station"
        size="sm"
      >
        <WorkCenterForm
          onSubmit={handleCreateWorkCenter}
          onCancel={() => setIsWcFormOpen(false)}
        />
      </Modal>

      {/* Details sheet */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedBom ? `${selectedBom.name} Specifications` : 'BOM details'}
        size="xl"
      >
        {selectedBom && (
          <div className="space-y-8">
            {/* Component breakdown costing editor */}
            <ComponentEditor bom={selectedBom} products={products} />
            
            {/* Routing steps */}
            <OperationEditor bom={selectedBom} workCenters={workCenters} />
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!bomToDelete}
        onClose={() => setBomToDelete(null)}
        onConfirm={handleDelete}
        title="Delete BOM?"
        message={`Are you sure you want to delete BOM recipe ${bomToDelete?.name}? Assemblies using this layout will lose references.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default BomPage;
// Export default
