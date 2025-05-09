import styled from 'styled-components';
import { useCartStore } from '../store/cartStore';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  background: rgba(255,255,255,0.85);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(48,116,219,0.18), 0 1.5px 8px 0 rgba(48,116,219,0.08);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1.5px solid rgba(48,116,219,0.12);
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
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
const ErrorMsg = styled.div`
  color: #d81e43;
  background: rgba(255,0,60,0.07);
  border-radius: 0.7rem;
  padding: 0.7rem 1rem;
  margin-bottom: 0.7rem;
  text-align: center;
  font-weight: 600;
  font-size: 1.05rem;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5em;
  &::before {
    content: '\26A0';
    font-size: 1.2em;
    color: #d81e43;
    margin-right: 0.3em;
  }
`;

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuth();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const [form, setForm] = useState({ name: '', email: '', address: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[k:string]:string}>({});
  const navigate = useNavigate();
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Google Places Autocomplete integration
  useEffect(() => {
    if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.places) return;
    const autocomplete = new (window as any).google.maps.places.Autocomplete(addressInputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'za' },
      fields: ['formatted_address'],
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      setForm(f => ({ ...f, address: place.formatted_address || '' }));
    });
    return () => {
      (window as any).google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: user.displayName || f.name,
        email: user.email || f.email,
        phone: user.phoneNumber || f.phone,
      }));
    }
  }, [user]);

  const validate = () => {
    const errs: {[k:string]:string} = {};
    if (!form.name) errs.name = 'Name required';
    if (!form.email) errs.email = 'Email required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.address) errs.address = 'Address required';
    if (!form.phone) errs.phone = 'Phone required';
    else if (!/^\+?\d{10,15}$/.test(form.phone.replace(/\D/g, ''))) errs.phone = 'Invalid phone';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors(errs => ({ ...errs, [e.target.name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      clearCart();
      setLoading(false);
    }, 1200);
  };

  if (submitted) {
    return (
      <Page>
        <Title>Order Placed!</Title>
        <CheckoutBox>
          <ThankYou>Thank you for your order!<br />We'll be in touch soon.</ThankYou>
          <CartSummary>
            {items.map(item => (
              <CartItem key={item.id}>
                <span>{item.name} ({item.size}) x {item.qty}</span>
                <span>R{(item.price * item.qty).toFixed(2)}</span>
              </CartItem>
            ))}
            <Total>Total: R{total.toFixed(2)}</Total>
          </CartSummary>
          <PlaceOrderBtn onClick={() => navigate('/')}>Back to Home</PlaceOrderBtn>
        </CheckoutBox>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Checkout</Title>
      <CheckoutBox>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required aria-invalid={!!fieldErrors.name} aria-describedby="name-err" />
          {fieldErrors.name && <ErrorMsg id="name-err">{fieldErrors.name}</ErrorMsg>}
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required aria-invalid={!!fieldErrors.email} aria-describedby="email-err" />
          {fieldErrors.email && <ErrorMsg id="email-err">{fieldErrors.email}</ErrorMsg>}
          <Label htmlFor="address">Shipping Address</Label>
          <Input ref={addressInputRef} id="address" name="address" value={form.address} onChange={handleChange} required aria-invalid={!!fieldErrors.address} aria-describedby="address-err" placeholder="Start typing your address..." />
          {fieldErrors.address && <ErrorMsg id="address-err">{fieldErrors.address}</ErrorMsg>}
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required aria-invalid={!!fieldErrors.phone} aria-describedby="phone-err" placeholder="e.g. 0821234567" />
          {fieldErrors.phone && <ErrorMsg id="phone-err">{fieldErrors.phone}</ErrorMsg>}
          <CartSummary>
            {items.map(item => (
              <CartItem key={item.id}>
                <span>{item.name} ({item.size}) x {item.qty}</span>
                <span>R{(item.price * item.qty).toFixed(2)}</span>
              </CartItem>
            ))}
            <Total>Total: R{total.toFixed(2)}</Total>
          </CartSummary>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <PlaceOrderBtn type="submit" disabled={items.length === 0 || loading}>{loading ? 'Processing...' : 'Place Order'}</PlaceOrderBtn>
        </Form>
      </CheckoutBox>
    </Page>
  );
} 