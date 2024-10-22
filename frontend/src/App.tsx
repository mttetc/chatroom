import { useEffect } from 'react';
import { initializeSocket } from './api/socket';
import ChatRoom from './components/ChatRoom';
import Layout from './components/Layout';
import { useAuthStore } from './stores/authStore';
import AuthScreen from './components/AuthScreen';

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return isAuthenticated ? (
    <Layout>
      <ChatRoom />
    </Layout>
  ) : (
    <AuthScreen />
  );
}

export default App;
