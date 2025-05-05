import React from 'react';

interface OrderDetailsProps {
  order: {
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
  };
  onStatusUpdate: (orderId: string, newStatus: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled') => Promise<void>;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onStatusUpdate }) => {
  // Example usage, update as needed
  return (
    <div>
      <h2>Order Details</h2>
      <div>Order ID: {order._id}</div>
      <div>Customer: {order.user.name} ({order.user.email})</div>
      <div>Status: {order.status}</div>
      <div>Payment Status: {order.paymentStatus}</div>
      <div>Total: R{order.total.toFixed(2)}</div>
      <div>Shipping Address: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</div>
      <h3>Items</h3>
      <ul>
        {order.items.map((item, idx) => (
          <li key={idx}>
            {item.product.name} x {item.quantity} (R{item.price.toFixed(2)})
          </li>
        ))}
      </ul>
      {/* Example status update button */}
      <button onClick={async () => await onStatusUpdate(order._id, 'shipped')}>Mark as Shipped</button>
    </div>
  );
};

export default OrderDetails; 