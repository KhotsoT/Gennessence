import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import OrderDetails from '../../components/admin/OrderDetails';

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

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #3074db;
    box-shadow: 0 0 0 3px rgba(48, 116, 219, 0.1);
  }
`;

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3074db;
    box-shadow: 0 0 0 3px rgba(48, 116, 219, 0.1);
  }
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

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'pending':
        return '#fef3c7';
      case 'paid':
        return '#dcfce7';
      case 'shipped':
        return '#dbeafe';
      case 'delivered':
        return '#dcfce7';
      case 'cancelled':
        return '#fee2e2';
      default:
        return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending':
        return '#92400e';
      case 'paid':
        return '#166534';
      case 'shipped':
        return '#1e40af';
      case 'delivered':
        return '#166534';
      case 'cancelled':
        return '#991b1b';
      default:
        return '#64748b';
    }
  }};
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  &.primary {
    background: #3074db;
    color: white;
    border: none;

    &:hover {
      background: #2563eb;
    }
  }

  &.secondary {
    background: white;
    color: #64748b;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #f8fafc;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  line-height: 1;

  &:hover {
    color: #1e293b;
  }
`;

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      image: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    startDate: '',
    endDate: '',
  });
  const { token } = useAdminAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        const response = await axios.get(`/api/orders?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await axios.patch(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>Orders</Title>
      </Header>

      <Filters>
        <Select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </Select>

        <Select
          name="paymentStatus"
          value={filters.paymentStatus}
          onChange={handleFilterChange}
        >
          <option value="">All Payment Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </Select>

        <DateInput
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          placeholder="Start Date"
        />

        <DateInput
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          placeholder="End Date"
        />
      </Filters>

      <Table>
        <thead>
          <tr>
            <Th>Order ID</Th>
            <Th>Customer</Th>
            <Th>Total</Th>
            <Th>Status</Th>
            <Th>Payment</Th>
            <Th>Date</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
              <Td>{order._id.slice(-6)}</Td>
              <Td>
                <div>{order.user.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  {order.user.email}
                </div>
              </Td>
              <Td>R{order.total.toFixed(2)}</Td>
              <Td>
                <StatusBadge status={order.status}>
                  {order.status}
                </StatusBadge>
              </Td>
              <Td>
                <StatusBadge status={order.paymentStatus}>
                  {order.paymentStatus}
                </StatusBadge>
              </Td>
              <Td>
                {new Date(order.createdAt).toLocaleDateString()}
              </Td>
              <Td>
                <Actions>
                  <Button
                    className="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(order._id, 'shipped');
                    }}
                    disabled={order.status !== 'paid'}
                  >
                    Ship
                  </Button>
                  <Button
                    className="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(order._id, 'delivered');
                    }}
                    disabled={order.status !== 'shipped'}
                  >
                    Deliver
                  </Button>
                </Actions>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedOrder && (
        <Modal onClick={() => setSelectedOrder(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setSelectedOrder(null)}>×</CloseButton>
            <OrderDetails
              order={selectedOrder}
              onStatusUpdate={handleStatusUpdate}
            />
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Orders; 