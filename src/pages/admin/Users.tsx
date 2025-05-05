import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const Container = styled.div`
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #1e293b;
  font-size: 1.875rem;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const SearchBar = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-right: 1rem;
  min-width: 250px;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-right: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background: #f8fafc;
  color: #1e293b;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #64748b;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #f1f5f9;
  margin-right: 0.75rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  border: none;

  &.primary {
    background: #3074db;
    color: white;
    &:hover { background: #2563eb; }
  }
  &.secondary {
    background: #f1f5f9;
    color: #3074db;
    border: 1px solid #3074db;
    &:hover { background: #e0e7ef; }
  }
  &.danger {
    background: #fee2e2;
    color: #991b1b;
    &:hover { background: #fecaca; }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  min-width: 350px;
  max-width: 95vw;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Pagination = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  align-items: center;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#dcfce7';
      case 'inactive': return '#fef3c7';
      case 'suspended': return '#fee2e2';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#166534';
      case 'inactive': return '#92400e';
      case 'suspended': return '#991b1b';
      default: return '#64748b';
    }
  }};
`;

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
}

const Users: React.FC = () => {
  const { token } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    avatar: '',
    role: 'user',
    status: 'active',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);
      const response = await axios.get(`/api/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search, roleFilter, statusFilter]);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      role: user.role,
      status: user.status,
    });
    setEditError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
    setEditError(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setEditLoading(true);
    setEditError(null);
    try {
      await axios.put(`/api/users/${selectedUser._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeModal();
      fetchUsers();
    } catch (error: any) {
      setEditError(error?.response?.data?.error || 'Error updating user');
    } finally {
      setEditLoading(false);
    }
  };

  // ... Edit, reset password, delete handlers will go here ...

  return (
    <Container>
      <Header>
        <Title>Users</Title>
        <Actions>
          <SearchBar
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <Select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </Select>
          <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </Select>
        </Actions>
      </Header>

      <Table>
        <thead>
          <tr>
            <Th>Avatar</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><Td colSpan={6}>Loading...</Td></tr>
          ) : users.length === 0 ? (
            <tr><Td colSpan={6}>No users found.</Td></tr>
          ) : users.map(user => (
            <tr key={user._id}>
              <Td><Avatar src={user.avatar || '/avatar-placeholder.png'} alt={user.name} /></Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td><StatusBadge status={user.status}>{user.status}</StatusBadge></Td>
              <Td>
                <Button className="primary" onClick={() => openEditModal(user)}>Edit</Button>
                {/* Add more action buttons here */}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Button className="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
        <span>Page {page} of {Math.ceil(total / limit) || 1}</span>
        <Button className="secondary" onClick={() => setPage(p => p + 1)} disabled={page * limit >= total}>Next</Button>
      </Pagination>

      {showModal && selectedUser && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <form onSubmit={handleEditSubmit}>
              <h2 style={{ color: '#1e293b', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Edit User</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label>
                  Avatar URL
                  <input
                    type="url"
                    name="avatar"
                    value={editForm.avatar}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                  />
                </label>
                <label>
                  Name
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                  />
                </label>
                <label>
                  Role
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </label>
                <label>
                  Status
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </label>
                {editError && <div style={{ color: '#dc2626', fontSize: '0.95rem' }}>{editError}</div>}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <Button type="button" className="secondary" onClick={closeModal} disabled={editLoading}>Cancel</Button>
                  <Button type="submit" className="primary" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</Button>
                </div>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Users; 