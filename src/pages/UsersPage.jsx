// src/pages/UsersPage.jsx
// Users and permissions administration workspace screen.

import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { userService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { Plus } from 'lucide-react';

// Components
import PageHeader from '../components/common/PageHeader';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import RolePermissionTable from '../components/users/RolePermissionTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('[UsersPage] fetch failed:', err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateOrUpdate = async (userData) => {
    try {
      if (selectedUser) {
        // Edit mode
        await userService.updateUser(selectedUser.id, userData);
        showToast('User profile updated successfully.', 'success');
      } else {
        // Create mode
        await userService.createUser(userData);
        showToast('New user registered successfully.', 'success');
      }
      setIsFormOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Operation failed.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await userService.deleteUser(userToDelete.id);
      showToast('User profile removed successfully.', 'success');
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to remove user.', 'error');
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const canManage = currentUser?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Users & Roles"
        subtitle="Manage employee system access and view credential permissions."
        actions={
          canManage && (
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors duration-150"
            >
              <Plus className="w-4 h-4" />
              <span>Create User</span>
            </button>
          )
        }
      />

      {/* Users grid list */}
      <UserList
        users={users}
        onEdit={handleEditClick}
        onDelete={setUserToDelete}
        loading={loading}
      />

      {/* Permissions Matrix */}
      <RolePermissionTable />

      {/* User Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedUser ? 'Edit User Credentials' : 'Register New User'}
        size="md"
      >
        <UserForm
          onSubmit={handleCreateOrUpdate}
          initialData={selectedUser}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Deletion Dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        title="Remove User?"
        message={`Are you sure you want to delete the credentials for ${userToDelete?.name}? They will lose access to FlowERP.`}
        confirmText="Remove"
        type="danger"
      />
    </div>
  );
};

export default UsersPage;
