import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { loginUser, registerUser, loginAnonymous } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';

const authSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormInputs = z.infer<typeof authSchema>;

const AuthScreen: React.FC = () => {
  const setAuth = useAuthStore(state => state.setAuth);
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<AuthFormInputs>({
    resolver: zodResolver(authSchema),
  });

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
  } = useForm<AuthFormInputs>({
    resolver: zodResolver(authSchema),
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: data => setAuth(data.user, data.access_token),
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: data => setAuth(data.user, data.access_token),
  });

  const anonymousLoginMutation = useMutation({
    mutationFn: loginAnonymous,
    onSuccess: data => setAuth(data.user, data.access_token),
  });

  const onLogin = (data: AuthFormInputs) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: AuthFormInputs) => {
    registerMutation.mutate(data);
  };

  const handleAnonymousLogin = () => {
    anonymousLoginMutation.mutate();
  };

  return (
    <div>
      <h2>Welcome to the Chat App</h2>
      <div>
        <h3>Sign In</h3>
        <form onSubmit={handleSubmitLogin(onLogin)}>
          <div>
            <input {...registerLogin('name')} type="text" placeholder="Name" />
            {loginErrors.name && <span>{loginErrors.name.message}</span>}
          </div>
          <div>
            <input
              {...registerLogin('password')}
              type="password"
              placeholder="Password"
            />
            {loginErrors.password && (
              <span>{loginErrors.password.message}</span>
            )}
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
      <div>
        <h3>Register</h3>
        <form onSubmit={handleSubmitSignup(onRegister)}>
          <div>
            <input {...registerSignup('name')} type="text" placeholder="Name" />
            {signupErrors.name && <span>{signupErrors.name.message}</span>}
          </div>
          <div>
            <input
              {...registerSignup('password')}
              type="password"
              placeholder="Password"
            />
            {signupErrors.password && (
              <span>{signupErrors.password.message}</span>
            )}
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
      <div>
        <button onClick={handleAnonymousLogin}>Join as Anonymous</button>
      </div>
    </div>
  );
};

export default AuthScreen;
