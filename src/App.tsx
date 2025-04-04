import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ChatBot } from './components/ChatBot';
import { Marketplace } from './pages/Marketplace';
import { AddProduct } from './pages/AddProduct';
import './i18n';
import AuthForm from './pages/authForms';
import Dashboard from './pages/Dashboard';
import Dashboard2 from './pages/Dashboard-2';
import RentalForm from './components/RentalForm';
import ProtectedRoute from './components/ProtectedRoute'; // Import the new component

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mt-16 mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Marketplace />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/login" element={<AuthForm type="login" />} />
            <Route path="/register" element={<AuthForm type="register" />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/farmers/:id" element={<Dashboard2 />} />
              <Route path="/rent-equipment" element={<RentalForm />} />
            </Route>
          </Routes>
        </main>
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;