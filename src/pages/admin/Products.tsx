import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

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

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

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
    color: #3074db;
    border: 1px solid #3074db;

    &:hover {
      background: #f8fafc;
    }
  }
`;

const SearchBar = styled.div`
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3074db;
    box-shadow: 0 0 0 3px rgba(48, 116, 219, 0.1);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ProductDetails = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => props.status === 'active' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.status === 'active' ? '#166534' : '#991b1b'};
`;

interface Product {
  _id: string;
  name: string;
  description: string;
  ph: number;
  size: number;
  price: number;
  image: string;
  benefits: string[];
  stock: number;
  status: 'active' | 'inactive';
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useAdminAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/products/export/csv', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting products:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>Products</Title>
        <Actions>
          <Button className="secondary" onClick={handleExport}>
            Export CSV
          </Button>
          <Button className="primary">
            Add Product
          </Button>
        </Actions>
      </Header>

      <SearchBar>
        <Input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
        />
      </SearchBar>

      <Grid>
        {filteredProducts.map(product => (
          <Card key={product._id}>
            <ProductImage src={product.image} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductDetails>
              <div>pH: {product.ph}</div>
              <div>Size: {product.size}ml</div>
              <div>Price: R{product.price.toFixed(2)}</div>
              <div>Stock: {product.stock}</div>
            </ProductDetails>
            <ProductActions>
              <StatusBadge status={product.status}>
                {product.status}
              </StatusBadge>
              <Button className="secondary">Edit</Button>
              <Button className="secondary">Delete</Button>
            </ProductActions>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default Products; 