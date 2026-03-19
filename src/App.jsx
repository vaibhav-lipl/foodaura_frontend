import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import AppRoutes from './routes/AppRoutes';
import SeoManager from './components/seo/SeoManager';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SeoManager />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
