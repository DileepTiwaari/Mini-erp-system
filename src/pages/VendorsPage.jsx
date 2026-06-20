// src/pages/VendorsPage.jsx
// Vendors catalog directory screen.

import React, { useState, useEffect } from 'react';
import purchaseService from '../services/purchaseService';
import { useToast } from '../context/ToastContext';
import { Plus } from 'lucide-react';

// Components
import PageHeader from '../components/common/PageHeader';
import SearchBar from '../components/common/SearchBar';
import VendorList from '../components/purchase/VendorList';
import VendorForm from '../components/purchase/VendorForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const VendorsPage = () => {
  const { showToast } = useToast();

  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await purchaseService.getVendors();
      setVendors(data);
    } catch (err) {
      showToast('Failed to load supplier directory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleCreateOrUpdate = async (vendorData) => {
    try {
      if (selectedVendor) {
        await purchaseService.updateVendor(selectedVendor.id, vendorData);
        showToast('Vendor profile updated successfully.', 'success');
      } else {
        await purchaseService.createVendor(vendorData);
        showToast('New vendor supplier registered.', 'success');
      }
      setIsFormOpen(false);
      setSelectedVendor(null);
      fetchVendors();
    } catch (err) {
      showToast('Failed to save vendor details.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!vendorToDelete) return;
    try {
      await purchaseService.deleteVendor(vendorToDelete.id);
      showToast('Vendor supplier removed.', 'success');
      setVendorToDelete(null);
      fetchVendors();
    } catch (err) {
      showToast('Failed to delete vendor.', 'error');
    }
  };

  const handleEditClick = (vendor) => {
    setSelectedVendor(vendor);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setSelectedVendor(null);
    setIsFormOpen(true);
  };

  const filteredVendors = vendors.filter((v) => {
    const q = searchQuery.toLowerCase();
    return v.name.toLowerCase().includes(q) || v.contactName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Vendors Directory"
        subtitle="Manage material suppliers, contact profiles, and shipping addresses."
        actions={
          <div className="flex items-center gap-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search suppliers..." />
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors duration-150"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supplier</span>
            </button>
          </div>
        }
      />

      {/* List */}
      <VendorList
        vendors={filteredVendors}
        onEdit={handleEditClick}
        onDelete={setVendorToDelete}
        loading={loading}
      />

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedVendor ? 'Edit Supplier Details' : 'Register Supplier Vendor'}
        size="md"
      >
        <VendorForm
          onSubmit={handleCreateOrUpdate}
          initialData={selectedVendor}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!vendorToDelete}
        onClose={() => setVendorToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Vendor?"
        message={`Are you sure you want to remove ${vendorToDelete?.name} from supplier listings?`}
        confirmText="Remove"
        type="danger"
      />
    </div>
  );
};

export default VendorsPage;
