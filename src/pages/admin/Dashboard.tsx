import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.h3`
  color: #1e293b;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const Stat = styled.div`
  font-size: 2rem;
  color: #3074db;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 0.875rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #1e293b;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const AdminDashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <Section>
        <SectionTitle>Overview</SectionTitle>
        <Grid>
          <Card>
            <CardTitle>Total Sales</CardTitle>
            <Stat>R 45,678</Stat>
            <StatLabel>Last 30 days</StatLabel>
          </Card>
          <Card>
            <CardTitle>Active Users</CardTitle>
            <Stat>1,234</Stat>
            <StatLabel>Total registered</StatLabel>
          </Card>
          <Card>
            <CardTitle>Orders</CardTitle>
            <Stat>89</Stat>
            <StatLabel>Pending fulfillment</StatLabel>
          </Card>
          <Card>
            <CardTitle>Products</CardTitle>
            <Stat>7</Stat>
            <StatLabel>In stock</StatLabel>
          </Card>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Recent Activity</SectionTitle>
        <Card>
          <p style={{ color: '#64748b' }}>Activity feed coming soon...</p>
        </Card>
      </Section>

      <Section>
        <SectionTitle>Quick Actions</SectionTitle>
        <Grid>
          <Card>
            <CardTitle>Add Product</CardTitle>
            <p style={{ color: '#64748b' }}>Create a new product listing</p>
          </Card>
          <Card>
            <CardTitle>View Orders</CardTitle>
            <p style={{ color: '#64748b' }}>Process pending orders</p>
          </Card>
          <Card>
            <CardTitle>User Management</CardTitle>
            <p style={{ color: '#64748b' }}>Manage user accounts</p>
          </Card>
        </Grid>
      </Section>
    </DashboardContainer>
  );
};

export default AdminDashboard; 