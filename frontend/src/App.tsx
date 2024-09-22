import { useEffect } from 'react';
import { connectSocket } from './api/socket';
import ChatRoom from './components/ChatRoom';
import Layout from './components/Layout';
import SocketManager from './components/SocketManager';

function App() {
  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <Layout>
      <SocketManager />
      <ChatRoom />
    </Layout>
  );
}

export default App;
