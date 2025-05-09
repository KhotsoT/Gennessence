import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

export async function getCart(token: string) {
  try {
    const res = await axios.get(`${API}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error('Failed to get cart:', error);
    throw error;
  }
}

export async function setCart(items: any[], token: string) {
  try {
    const res = await axios.post(`${API}/api/cart`, { items }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error('Failed to set cart:', error);
    throw error;
  }
}

export async function clearCart(token: string) {
  try {
    const res = await axios.delete(`${API}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error('Failed to clear cart:', error);
    throw error;
  }
} 