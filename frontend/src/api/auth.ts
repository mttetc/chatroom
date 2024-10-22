import { useAuthStore } from '@/stores/authStore';
import { initializeSocket } from './socket';

export const loginUser = async (name: string, password: string) => {
  const response = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const data = await response.json();
  useAuthStore.getState().setAuth(data.user, data.access_token);
  initializeSocket();
  return data;
};

export const registerUser = async (name: string, password: string) => {
  const response = await fetch('http://localhost:3001/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, password }),
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  const data = await response.json();
  useAuthStore.getState().setAuth(data.user, data.access_token);
  initializeSocket();
  return data;
};

export const loginAnonymous = async () => {
  const { user } = useAuthStore.getState();
  const body = user ? { id: user.id } : {};

  const response = await fetch('http://localhost:3001/auth/anonymous', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error('Anonymous login failed');
  }
  const data = await response.json();
  useAuthStore.getState().setAuth(data.user, data.access_token);
  return data;
};
