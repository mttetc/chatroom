export const loginUser = async (name: string, password: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    }
  );
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
};

export const registerUser = async (name: string, password: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    }
  );
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
};

export const loginAnonymous = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/auth/anonymous`,
    {
      method: 'POST',
    }
  );
  if (!response.ok) {
    throw new Error('Anonymous login failed');
  }
  return response.json();
};
