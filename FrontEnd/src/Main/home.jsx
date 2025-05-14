import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from './Components/NavBar';
import Sidebar from './Components/SideBar';
import Card from './Components/Card';

const HomePage = () => {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState(null); 
  const [error, setError] = useState(""); 
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
  
  const stored = localStorage.getItem("patient");
  useEffect(() => {
    if (stored) {
      const user = JSON.parse(stored); 
      if (user.name) {
        setUserName(user.name);
      }
    }
  }, [stored]);

  // Function to fetch user data from the protected API endpoint
  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if(!token){
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
    
  }, [navigate]); 

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Navbar user={userName} onProfileClick={() => setSidebarOpen(true)} />
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 mt-10 max-w-5xl mx-auto">
        <Card title="Scheduling Appointment" />
        <Card title="Medical History" />
        <Card title="Therapy Sessions" />
        <Card title="Wellness Tips" />
      </div>

      {/* Display user data or error message */}
      <div>
        {userData ? (
          <div>
            <h2>Welcome, {userData.name}!</h2>
            {/* Render user data as needed */}
          </div>
        ) : (
          <p>{error}</p> 
        )}
      </div>
    </div>
  );
};

export default HomePage;

