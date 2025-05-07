import styled from 'styled-components';
import { useCartStore } from '../store/cartStore';
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
  font-size: 2.5rem;
  font-weight: 800;
  color: #3074db;
  margin-bottom: 2.5rem;
  text-align: center;
`;

const CartBox = styled.div`
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

export default function Cart() {
  const { items, updateQty, removeFromCart } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const navigate = useNavigate();

  return (
    <Page>
      <Title>Your Cart</Title>
      <CartBox>
        {items.length === 0 ? (
          <Empty>Your cart is empty.<br />Start adding some refreshing water!</Empty>
        ) : (
          <>
            {items.map(item => (
              <CartItemRow key={item.id}>
                <ItemImg src={item.image} alt={item.name} />
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemSize>{item.size}</ItemSize>
                  <ItemPrice>R{item.price.toFixed(2)}</ItemPrice>
                </ItemInfo>
                <QtyControls>
                  <QtyBtn onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}>-</QtyBtn>
                  <span style={{ minWidth: '1.5rem', textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                  <QtyBtn onClick={() => updateQty(item.id, item.qty + 1)}>+</QtyBtn>
                </QtyControls>
                <Subtotal>R{(item.price * item.qty).toFixed(2)}</Subtotal>
                <RemoveBtn onClick={() => removeFromCart(item.id)} title="Remove">×</RemoveBtn>
              </CartItemRow>
            ))}
            <Total>Total: R{total.toFixed(2)}</Total>
            <CheckoutBtn disabled={items.length === 0} onClick={() => navigate('/checkout')}>Checkout</CheckoutBtn>
          </>
        )}
      </CartBox>
    </Page>
  );
} 