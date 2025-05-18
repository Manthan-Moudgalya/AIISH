import React from 'react';
import { X } from 'lucide-react';

const Sidebar = ({ onClose }) => {

  const logOut = () => {
      localStorage.removeItem('token');
      window.location.reload(); 
  }
  
  return(
    <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 p-6 transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Profile Menu</h2>
        <X className="cursor-pointer" onClick={onClose} />
      </div>
      <ul className="space-y-4">
        <li className="hover:text-blue-600 cursor-pointer">My Profile</li>
        <li className="hover:text-blue-600 cursor-pointer">Settings</li>
        <li className="hover:text-blue-600 cursor-pointer" onClick={logOut}>Logout</li>
      </ul>
    </div>
  )
}
export default Sidebar;
