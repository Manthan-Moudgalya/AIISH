import { useState, useEffect } from 'react'; 
import { useNavigate } from "react-router-dom"; 
import Navbar from './Components/NavBar'; 
import Sidebar from './Components/SideBar'; 
import Card from './Components/Card'; 
import ChatBot from './Components/chatBot';
import './home.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
    
  const stored = localStorage.getItem("patient");
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (stored) {
      const user = JSON.parse(stored);
      if (user.name) {
        setUserName(user.name);
      }
    }
  }, [stored]);
     
  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
  
    fetch(`${BASE_URL}/api/appointments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to fetch data');
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [token, navigate, BASE_URL]);
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" id="home-page">
      <ChatBot />
      <Navbar user={userName} onProfileClick={() => setSidebarOpen(true)} />
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
             
      <div className="py-10 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center">Welcome to Your Health Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="Scheduling Appointment" />
          <Card title="Medical History" />
          <Card title="Wellness Tips" />
          <Card title="Shared Notes" />
        </div>
      
        {/* Display user data or error message */}
        <div className="mt-10 bg-white rounded-lg shadow-md p-6">
          {userData ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">Welcome, {userData.name}!</h2>
              {/* Render user data as needed */}
              <p className="mt-2 text-gray-600">Your upcoming appointments and health information are ready for review.</p>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <p className="text-gray-500 text-center">Loading your information...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 

