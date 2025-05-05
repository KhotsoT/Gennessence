import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #1e293b;
  font-weight: 500;
`;

const Input = styled.input`
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

const TextArea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3074db;
    box-shadow: 0 0 0 3px rgba(48, 116, 219, 0.1);
  }
`;

const BenefitsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const BenefitTag = styled.div`
  background: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  font-size: 1.25rem;
  line-height: 1;

  &:hover {
    color: #ef4444;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &.primary {
    background: #3074db;
    color: white;
    border: none;

    &:hover {
      background: #2563eb;
    }

    &:disabled {
      background: #93c5fd;
      cursor: not-allowed;
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

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

interface ProductFormProps {
  product?: {
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
  };
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description: string;
  ph: string;
  size: string;
  price: string;
  image: string;
  stock: string;
  status: 'active' | 'inactive';
  newBenefit: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    ph: '',
    size: '',
    price: '',
    image: '',
    stock: '',
    status: 'active',
    newBenefit: '',
  });
  const [benefits, setBenefits] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAdminAuth();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        ph: product.ph.toString(),
        size: product.size.toString(),
        price: product.price.toString(),
        image: product.image,
        stock: product.stock.toString(),
        status: product.status,
        newBenefit: '',
      });
      setBenefits(product.benefits);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBenefit = () => {
    if (formData.newBenefit.trim()) {
      setBenefits(prev => [...prev, formData.newBenefit.trim()]);
      setFormData(prev => ({ ...prev, newBenefit: '' }));
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = {
        ...formData,
        ph: parseFloat(formData.ph),
        size: parseInt(formData.size),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        benefits,
      };

      if (product) {
        await axios.put(`/api/products/${product._id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/products', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>{product ? 'Edit Product' : 'Add New Product'}</Title>

      <Grid>
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>pH Level</Label>
          <Input
            type="number"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
            min="0"
            max="14"
            step="0.1"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Size (ml)</Label>
          <Input
            type="number"
            name="size"
            value={formData.size}
            onChange={handleChange}
            min="0"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Price (R)</Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Stock</Label>
          <Input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Image URL</Label>
          <Input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup style={{ gridColumn: '1 / -1' }}>
          <Label>Description</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup style={{ gridColumn: '1 / -1' }}>
          <Label>Benefits</Label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Input
              type="text"
              name="newBenefit"
              value={formData.newBenefit}
              onChange={handleChange}
              placeholder="Add a benefit"
            />
            <Button
              type="button"
              className="secondary"
              onClick={handleAddBenefit}
            >
              Add
            </Button>
          </div>
          <BenefitsList>
            {benefits.map((benefit, index) => (
              <BenefitTag key={index}>
                {benefit}
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveBenefit(index)}
                >
                  ×
                </RemoveButton>
              </BenefitTag>
            ))}
          </BenefitsList>
        </FormGroup>
      </Grid>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Actions>
        <Button
          type="button"
          className="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </Actions>
    </Form>
  );
};

export default ProductForm; 