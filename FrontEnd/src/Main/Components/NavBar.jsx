import React from 'react';

const Navbar = ({ user, onProfileClick }) => (
  <nav className="bg-white shadow flex items-center justify-between px-6 py-4">
    {/* <div className="text-xl font-bold">AI Health Assist ant</div> */}
    <div className="w-full flex justify-between items-center">
      <img 
        src="https://via.placeholder.com/40" 
        alt="Profile" 
        className="w-10 h-10 rounded-full cursor-pointer"
        onClick={onProfileClick}
      />

      <span className='font-bold text-[1.8em]' >Home Page</span>
      <span className="text-gray-700">Hi {user}!</span>
    </div>
  </nav>
);

export default Navbar;

// import React from 'react'

// const NavBar = ({ user, toggleSidebar }) => {
//     return (
//         <nav className="w-{100%} bg-blue-600 p-4 flex justify-between items-center">
//           <div className="text-white text-xl font-bold">Healthcare Dashboard</div>
//           <div className="flex items-center space-x-4">
//             <span className="text-white">Hi, {user}!</span>
//             <img
//               src="https://via.placeholder.com/40"
//               alt="Profile"
//               className="w-10 h-10 rounded-full cursor-pointer"
//               onClick={toggleSidebar}
//             />
//           </div>
//         </nav>
        
//       );
// }

// export default NavBar;
