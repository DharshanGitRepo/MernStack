import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { getMe } from './store/slices/authSlice';

// Components
import Navbar from './components/layout/Navbar';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ItemList from './components/items/ItemList';
import ItemDetail from './components/items/ItemDetail';
import ItemForm from './components/items/ItemForm';
import Profile from './components/user/Profile';
import UserItems from './components/user/UserItems';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        <Navbar />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Navigate to="/items" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/items" element={<ItemList />} />
            <Route
              path="/items/new"
              element={
                <ProtectedRoute>
                  <ItemForm />
                </ProtectedRoute>
              }
            />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-items"
              element={
                <ProtectedRoute>
                  <UserItems />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
