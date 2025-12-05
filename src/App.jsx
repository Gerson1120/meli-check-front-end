import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';

// ADMIN
import AdminDashboard from './pages/admin/AdminDashboard';
import StoresList from './pages/admin/StoresList';
import StoreForm from './pages/admin/StoreForm';
import DealerForm from './pages/admin/DealerForm';
import DealerList from './pages/admin/DealerList';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import AssignmentsList from './pages/admin/assignments/AssignmentsList';
import CreateAssignment from './pages/admin/assignments/CreateAssignment';
import EditAssignment from './pages/admin/assignments/EditAssignment';

// DEALER
import DealerHome from './pages/dealer/DealerHome';
import DealerAssignments from './pages/dealer/DealerAssignments';
import DealerAssignmentDetails from './pages/dealer/DealerAssignmentDetails';
import DealerVisits from './pages/dealer/DealerVisits';
import DealerVisitDetails from './pages/dealer/DealerVisitDetails';
import DealerScan from './pages/dealer/DealerScan';
import DealerOrderForm from './pages/dealer/DealerOrderForm';
import DealerOrders from './pages/dealer/DealerOrders';
import DealerOrderDetail from './pages/dealer/DealerOrderDetail';
import DebugAuth from './pages/dealer/DebugAuth';

import PrivateRoute from './components/PrivateRoute';

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

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* ADMIN */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/stores" element={<ProtectedRoute requiredRole="ADMIN"><StoresList /></ProtectedRoute>} />
          <Route path="/admin/stores/create" element={<ProtectedRoute requiredRole="ADMIN"><StoreForm /></ProtectedRoute>} />
          <Route path="/admin/stores/edit/:id" element={<ProtectedRoute requiredRole="ADMIN"><StoreForm /></ProtectedRoute>} />

          <Route path="/admin/dealers" element={<ProtectedRoute requiredRole="ADMIN"><DealerList /></ProtectedRoute>} />
          <Route path="/admin/dealers/new" element={<ProtectedRoute requiredRole="ADMIN"><DealerForm /></ProtectedRoute>} />
          <Route path="/admin/dealers/:id" element={<ProtectedRoute requiredRole="ADMIN"><DealerForm /></ProtectedRoute>} />

          <Route path="/admin/products" element={<ProtectedRoute requiredRole="ADMIN"><ProductList /></ProtectedRoute>} />
          <Route path="/admin/products/new" element={<ProtectedRoute requiredRole="ADMIN"><ProductForm /></ProtectedRoute>} />
          <Route path="/admin/products/:id" element={<ProtectedRoute requiredRole="ADMIN"><ProductForm /></ProtectedRoute>} />

          <Route path="/admin/assignments" element={<ProtectedRoute requiredRole="ADMIN"><AssignmentsList /></ProtectedRoute>} />
          <Route path="/admin/assignments/create" element={<ProtectedRoute requiredRole="ADMIN"><CreateAssignment /></ProtectedRoute>} />
          <Route path="/admin/assignments/:id" element={<ProtectedRoute requiredRole="ADMIN"><EditAssignment /></ProtectedRoute>} />


          {/* DEALER */}
          <Route
            path="/dealer/home"
            element={<ProtectedRoute requiredRole="DEALER"><DealerHome /></ProtectedRoute>}
          />

          <Route
            path="/dealer/assignments"
            element={<ProtectedRoute requiredRole="DEALER"><DealerAssignments /></ProtectedRoute>}
          />

          <Route
            path="/dealer/assignments/:id"
            element={<ProtectedRoute requiredRole="DEALER"><DealerAssignmentDetails /></ProtectedRoute>}
          />

          <Route
            path="/dealer/visits"
            element={<ProtectedRoute requiredRole="DEALER"><DealerVisits /></ProtectedRoute>}
          />

          <Route
            path="/dealer/visits/:id"
            element={<ProtectedRoute requiredRole="DEALER"><DealerVisitDetails /></ProtectedRoute>}
          />

          <Route
            path="/dealer/scan"
            element={<ProtectedRoute requiredRole="DEALER"><DealerScan /></ProtectedRoute>}
          />

          <Route
            path="/dealer/visits/:visitId/order"
            element={<ProtectedRoute requiredRole="DEALER"><DealerOrderForm /></ProtectedRoute>}
          />

          <Route
            path="/dealer/orders"
            element={<ProtectedRoute requiredRole="DEALER"><DealerOrders /></ProtectedRoute>}
          />

          <Route
            path="/dealer/orders/:orderId"
            element={<ProtectedRoute requiredRole="DEALER"><DealerOrderDetail /></ProtectedRoute>}
          />

          <Route
            path="/dealer/debug"
            element={<ProtectedRoute requiredRole="DEALER"><DebugAuth /></ProtectedRoute>}
          />

          {/* DEFAULT */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;