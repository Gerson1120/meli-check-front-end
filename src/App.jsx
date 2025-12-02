import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DealerHome from './pages/dealer/DealerHome';
import AdminDashboard from './pages/admin/AdminDashboard';
import StoresList from './pages/admin/StoresList';
import StoreForm from './pages/admin/StoreForm';
import DealerForm from './pages/admin/DealerForm';
import DealerList from './pages/admin/DealerList';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) 
    return <div className="p-10 text-center">Cargando MeliCheck...</div>;
  
  if (!user) 
    return <Navigate to="/login" />;

  const role = user?.rol?.roleEnum;

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'ADMIN' ? '/admin/dashboard' : '/dealer/home'} />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/dealer/*" element={
            <ProtectedRoute requiredRole="DEALER">
              <DealerHome />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />

                    <Route path="/admin/stores" element={
            <ProtectedRoute requiredRole="ADMIN">
              <StoresList />
            </ProtectedRoute>
          } />

          <Route path="/admin/stores/create" element={
            <ProtectedRoute requiredRole="ADMIN">
              <StoreForm />
            </ProtectedRoute>
          } />

          <Route path="/admin/stores/edit/:id" element={
            <ProtectedRoute requiredRole="ADMIN">
              <StoreForm />
            </ProtectedRoute>
          } />

          <Route path="/admin/dealers" element={<DealerList />} />
          <Route path="/admin/dealers/new" element={<DealerForm />} />
          <Route path="/admin/dealers/:id" element={<DealerForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;