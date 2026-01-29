import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import CreateBlog from './pages/CreateBlog';
import HomeDashboard from './pages/HomeDashboard';
import Header from './components/Header';
import ViewBlog from './pages/ViewBlog';
import EditBlog from './pages/EditBlog';
import MyBlogs from './pages/MyBlogs';
import ProtectRoute from './components/ProtectRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Header />}>
          <Route path="/logout" element={<Logout />} />
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/dashboard" element={<ProtectRoute><HomeDashboard /></ProtectRoute>}/>
          <Route path="/createblog" element={<ProtectRoute><CreateBlog /></ProtectRoute>}/>
          <Route path="blog/:id" element={<ProtectRoute><ViewBlog /></ProtectRoute>}/>
          <Route path="/my-blogs" element={<ProtectRoute><MyBlogs /></ProtectRoute>}/>
          <Route path="/edit/:id" element={<ProtectRoute><EditBlog /></ProtectRoute>}/>
        </Route>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );

}

export default App;
