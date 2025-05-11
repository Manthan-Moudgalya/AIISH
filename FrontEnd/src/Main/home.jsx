import { useState } from 'react';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import SearchBar from './Components/SearchBar';
import Card from './Components/Card';

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = "Johan Seong";



  return (
    <div className="min-h-screen w-{100%} bg-gray-100">
      <Navbar user={user} onProfileClick={() => setSidebarOpen(true)} />
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      <SearchBar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 mt-10 max-w-5xl mx-auto">
        <Card title="Scheduling Appointment" />
        <Card title="Medical History" />
        <Card title="Therapy Sessions" />
        <Card title="Wellness Tips" />
      </div>
    </div>
  );
};

export default HomePage;

// import {React, useState} from 'react'
// import DashboardCard  from './Components/Card';
// import Sidebar  from './Components/SideBar';
// import SearchBar  from './Components/SearchBar';
// import Navbar from './Components/NavBar'

// const home = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const user = 'User'; 

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   return (
//       <div>
//           <Navbar user={user} toggleSidebar={toggleSidebar} />
//           <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//           <SearchBar />
//           {/* <div className="container mx-auto p-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <DashboardCard title="Scheduling Appointment" />
//                   <DashboardCard title="Medical History" />
//                   <DashboardCard title="Therapy Sessions" />
//                   <DashboardCard title="Health Insights" />
//               </div>
//           </div> */}
//       </div>
//   );
// }

// export default home;