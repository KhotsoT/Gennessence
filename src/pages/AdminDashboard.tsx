import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import { useAuth } from '../context/AuthContext';

const AdminDashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #eee;
  font-weight: 600;
  color: #333;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3074db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background-color: #2581c4;
  }
`;

const AdminDashboard: React.FC = () => {
  // const { currentUser, assignAdminRole } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Fetch users from your backend or mock data
    const mockUsers = [
      { id: 1, email: 'user1@example.com', role: 'user' },
      { id: 2, email: 'user2@example.com', role: 'user' },
    ];
    setUsers(mockUsers);
  }, []);

  const handleAssignAdmin = async () => {
    // if (currentUser) {
    //   await assignAdminRole(currentUser.uid);
    //   alert('Admin role assigned successfully!');
    // }
  };

  return (
    <AdminDashboardContainer>
      <Title>Admin Dashboard</Title>
      <UserTable>
        <thead>
          <tr>
            <TableHeader>Email</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button onClick={handleAssignAdmin}>Assign Admin</Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </UserTable>
    </AdminDashboardContainer>
  );
};

export default AdminDashboard;
