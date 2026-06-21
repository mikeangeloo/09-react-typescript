import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '56px 48px 96px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
