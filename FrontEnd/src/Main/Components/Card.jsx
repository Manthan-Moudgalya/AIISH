import React from 'react';

const Card = ({ title }) => (
  <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition cursor-pointer">
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="text-gray-600 mt-2">Explore and manage your {title.toLowerCase()}.</p>
  </div>
);

export default Card;

// import React from 'react'

// const DashboardCard = ({ title }) => {
//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//           <h2 className="text-xl font-semibold">{title}</h2>
//           <p className="text-gray-600 mt-2">Manage your {title.toLowerCase()} here.</p>
//         </div>
//       );
// }

// export default DashboardCard;