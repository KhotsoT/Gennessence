import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CardTitle = styled.div`
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const CardValue = styled.div`
  color: #3074db;
  font-size: 2rem;
  font-weight: 700;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const TopProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProductImage = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 0.5rem;
  background: #f1f5f9;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-weight: 600;
  color: #1e293b;
`;

const ProductStats = styled.div`
  color: #64748b;
  font-size: 0.95rem;
`;

const Analytics: React.FC = () => {
  const { token } = useAdminAuth();
  const [overview, setOverview] = useState<any>(null);
  const [statusBreakdown, setStatusBreakdown] = useState<any[]>([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState<any[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [overviewRes, trendRes, topRes] = await Promise.all([
          axios.get('/api/orders/stats/overview', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/orders/stats/revenue-trend', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/orders/stats/top-products', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setOverview(overviewRes.data.overview);
        setStatusBreakdown(overviewRes.data.statusBreakdown);
        setPaymentBreakdown(overviewRes.data.paymentBreakdown);
        setRevenueTrend(trendRes.data);
        setTopProducts(topRes.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <Container>
      <Header>
        <Title>Analytics Dashboard</Title>
      </Header>

      <Grid>
        <Card>
          <CardTitle>Total Orders</CardTitle>
          <CardValue>{overview?.totalOrders ?? 0}</CardValue>
        </Card>
        <Card>
          <CardTitle>Total Revenue</CardTitle>
          <CardValue>R{overview?.totalRevenue?.toFixed(2) ?? '0.00'}</CardValue>
        </Card>
        <Card>
          <CardTitle>Avg. Order Value</CardTitle>
          <CardValue>R{overview?.avgOrderValue?.toFixed(2) ?? '0.00'}</CardValue>
        </Card>
      </Grid>

      <Section>
        <SectionTitle>Revenue Trend (Last 30 Days)</SectionTitle>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalRevenue" stroke="#3074db" strokeWidth={3} dot={false} name="Revenue" />
            <Line type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={2} dot={false} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      <Section>
        <SectionTitle>Order Status Breakdown</SectionTitle>
        <Grid>
          {statusBreakdown.map((s: any) => (
            <Card key={s._id}>
              <CardTitle>{s._id.charAt(0).toUpperCase() + s._id.slice(1)}</CardTitle>
              <CardValue>{s.count}</CardValue>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Payment Status Breakdown</SectionTitle>
        <Grid>
          {paymentBreakdown.map((p: any) => (
            <Card key={p._id}>
              <CardTitle>{p._id.charAt(0).toUpperCase() + p._id.slice(1)}</CardTitle>
              <CardValue>{p.count}</CardValue>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Top Products</SectionTitle>
        <TopProductsList>
          {topProducts.map((prod: any) => (
            <ProductItem key={prod.productId}>
              <ProductImage src={prod.image} alt={prod.name} />
              <ProductInfo>
                <ProductName>{prod.name}</ProductName>
                <ProductStats>
                  Sold: {prod.totalSold} &nbsp;|&nbsp; Revenue: R{prod.totalRevenue.toFixed(2)}
                </ProductStats>
              </ProductInfo>
            </ProductItem>
          ))}
        </TopProductsList>
      </Section>
    </Container>
  );
};

export default Analytics; 