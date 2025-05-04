import styled from 'styled-components';

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

export default function Cart() {
  // Placeholder: no items in cart
  const cartItems = [];

  return (
    <Page>
      <Title>Your Cart</Title>
      <CartBox>
        {cartItems.length === 0 ? (
          <Empty>Your cart is empty.<br />Start adding some refreshing water!</Empty>
        ) : (
          <div>{/* Render cart items here */}</div>
        )}
        <CheckoutBtn disabled={cartItems.length === 0}>Checkout</CheckoutBtn>
      </CartBox>
    </Page>
  );
} 