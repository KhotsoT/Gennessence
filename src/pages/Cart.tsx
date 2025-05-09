import styled from 'styled-components';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6fbff 0%, #eaf3fa 100%);
  padding: 3rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #3074db;
  margin-bottom: 2.5rem;
  text-align: center;
`;

const CartBox = styled.div`
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

const Empty = styled.div`
  color: #64748b;
  font-size: 1.2rem;
  margin: 2rem 0 2.5rem 0;
  text-align: center;
`;

const CheckoutBtn = styled.button`
  background: #3074db;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
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

const CartItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  width: 100%;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e7ef;
  padding-bottom: 1.1rem;
`;
const ItemImg = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 0.7rem;
  background: #f6fbff;
`;
const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;
const ItemName = styled.div`
  font-weight: 700;
  color: #2056a8;
  font-size: 1.08rem;
`;
const ItemSize = styled.div`
  color: #334155;
  font-size: 0.98rem;
`;
const ItemPrice = styled.div`
  color: #1b8ec2;
  font-size: 1.05rem;
  font-weight: 600;
`;
const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const QtyBtn = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  background: #e0e7ef;
  color: #2056a8;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #dbeafe;
  }
`;
const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #d81e43;
  font-size: 1.3rem;
  cursor: pointer;
  margin-left: 0.5rem;
  &:hover {
    color: #b91c1c;
  }
`;
const Subtotal = styled.div`
  color: #334155;
  font-size: 1.05rem;
  font-weight: 600;
  margin-left: 0.7rem;
`;
const Total = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: #2056a8;
  margin-top: 1.5rem;
  text-align: right;
  width: 100%;
`;

const EmptyIcon = styled.div`
  font-size: 3.5rem;
  color: #b6d4fa;
  margin-bottom: 1.2rem;
`;

const StickyCheckout = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  z-index: 10;
  @media (min-width: 700px) {
    position: static;
    margin-top: 2rem;
  }
`;

function CartItemRowMod({ item, updateQty, removeFromCart }: any) {
  return (
    <CartItemRow tabIndex={0} aria-label={`Cart item: ${item.name}, size ${item.size}, quantity ${item.qty}`}> 
      <ItemImg src={item.image} alt={item.name} />
      <ItemInfo>
        <ItemName>{item.name}</ItemName>
        <ItemSize>{item.size}</ItemSize>
        <ItemPrice>R{item.price.toFixed(2)}</ItemPrice>
      </ItemInfo>
      <QtyControls>
        <QtyBtn aria-label="Decrease quantity" onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))} disabled={item.qty === 1} tabIndex={0}>
          -
        </QtyBtn>
        <span style={{ minWidth: '1.5rem', textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
        <QtyBtn aria-label="Increase quantity" onClick={() => updateQty(item.id, item.qty + 1)} tabIndex={0}>
          +
        </QtyBtn>
      </QtyControls>
      <Subtotal>R{(item.price * item.qty).toFixed(2)}</Subtotal>
      <RemoveBtn aria-label={`Remove ${item.name}`} onClick={() => removeFromCart(item.id)} title="Remove" tabIndex={0}>×</RemoveBtn>
    </CartItemRow>
  );
}

export default function Cart() {
  const { items, updateQty, removeFromCart } = useCartStore();
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    if (user) {
      user.getIdToken().then(t => { if (isMounted) setToken(t); });
    } else {
      setToken(null);
    }
    return () => { isMounted = false; };
  }, [user]);

  const handleUpdateQty = (id: string, qty: number) => {
    updateQty(id, qty, token || undefined);
  };
  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id, token || undefined);
  };

  return (
    <Page>
      <Title>Your Cart</Title>
      <CartBox>
        {items.length === 0 ? (
          <>
            <EmptyIcon aria-hidden="true">💧</EmptyIcon>
            <Empty>Your cart is empty.<br />Start adding some refreshing water!</Empty>
          </>
        ) : (
          <>
            {items.map(item => (
              <CartItemRowMod key={item.id} item={item} updateQty={handleUpdateQty} removeFromCart={handleRemoveFromCart} />
            ))}
            <Total>Total: R{total.toFixed(2)}</Total>
            <StickyCheckout>
              <CheckoutBtn disabled={items.length === 0} onClick={() => navigate('/checkout')} aria-label="Proceed to checkout">Checkout</CheckoutBtn>
            </StickyCheckout>
          </>
        )}
      </CartBox>
    </Page>
  );
} 