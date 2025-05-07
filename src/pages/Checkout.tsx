import styled from 'styled-components';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6fbff 0%, #eaf3fa 100%);
  padding: 3rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  color: #3074db;
  margin-bottom: 2rem;
  text-align: center;
`;
const CheckoutBox = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(0,60,255,0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;
const Label = styled.label`
  font-weight: 600;
  color: #2056a8;
  margin-bottom: 0.3rem;
`;
const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 0.7rem;
  border: 1.5px solid #e0e7ef;
  font-size: 1.08rem;
  background: #f6fbff;
  &:focus {
    outline: none;
    border-color: #3074db;
    background: #fff;
  }
`;
const CartSummary = styled.div`
  width: 100%;
  margin: 1.5rem 0 1rem 0;
  border-radius: 1rem;
  background: #f6fbff;
  padding: 1.2rem 1rem;
  box-shadow: 0 2px 8px 0 #3074db11;
`;
const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.7rem;
  font-size: 1.05rem;
`;
const Total = styled.div`
  font-size: 1.18rem;
  font-weight: 800;
  color: #2056a8;
  margin-top: 1.1rem;
  text-align: right;
`;
const PlaceOrderBtn = styled.button`
  background: #3074db;
  color: #fff;
  font-size: 1.15rem;
  font-weight: 700;
  padding: 1rem 2.5rem;
  border-radius: 999px;
  border: none;
  box-shadow: 0 4px 16px 0 rgba(0,60,255,0.10);
  margin-top: 2rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: #2056a8;
    transform: scale(1.04);
  }
`;
const ThankYou = styled.div`
  color: #1b8ec2;
  font-size: 1.35rem;
  font-weight: 700;
  text-align: center;
  margin: 2.5rem 0 1.5rem 0;
`;

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const [form, setForm] = useState({ name: '', email: '', address: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.address || !form.phone) {
      setError('Please fill in all fields.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <Page>
        <Title>Order Placed!</Title>
        <CheckoutBox>
          <ThankYou>Thank you for your order!<br />We'll be in touch soon.</ThankYou>
          <PlaceOrderBtn onClick={() => navigate('/')}>Back to Home</PlaceOrderBtn>
        </CheckoutBox>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Checkout</Title>
      <CheckoutBox>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Label htmlFor="address">Shipping Address</Label>
          <Input id="address" name="address" value={form.address} onChange={handleChange} required />
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
          <CartSummary>
            {items.map(item => (
              <CartItem key={item.id}>
                <span>{item.name} ({item.size}) x {item.qty}</span>
                <span>R{(item.price * item.qty).toFixed(2)}</span>
              </CartItem>
            ))}
            <Total>Total: R{total.toFixed(2)}</Total>
          </CartSummary>
          {error && <div style={{ color: '#d81e43', marginBottom: '0.7rem', textAlign: 'center' }}>{error}</div>}
          <PlaceOrderBtn type="submit" disabled={items.length === 0}>Place Order</PlaceOrderBtn>
        </Form>
      </CheckoutBox>
    </Page>
  );
} 