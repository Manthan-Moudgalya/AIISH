// import { useEffect, useState } from 'react';
import './DoctorDashboard.css';
import { useNavigate } from "react-router-dom";
import SlotMatrix from './slotMatrix/slotMatrix';


const DoctorDashboard = () => {
  // const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
  const navigate = useNavigate();
  // const [appointments, setAppointments] = useState([]);
  // const [loading, setLoading] = useState(true);

  const doctorInfo = JSON.parse(localStorage.getItem("doctor"));

  const logOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('doctor');
    // window.location.reload();
    navigate('/DoctorLogin', { replace: true })
  };

  // const generateWorkingDates = () => {
  //   const dates = [];
  //   const today = new Date();
  //   let offset = 0;

  //   while (dates.length < 20) {
  //     const date = new Date();
  //     date.setDate(today.getDate() + offset);
  //     const day = date.getDay();

  //     if (day !== 0 && day !== 6) {
  //       dates.push(date.toISOString().split('T')[0]);
  //     }
  //     offset++;
  //   }

  //   return dates;
  // };

//   const generateWorkingDates = () => {
//   // Start from May 15, 2025 to ensure we include all sample appointment dates
//   const current = new Date(); 
  
//   const result = [];
//   const count = 20;
//   // Get at least 10 working days to include all sample appointments
//   while (result.length < count) {
//     const day = current.getDay();
//     if (day !== 0 && day !== 6) { // Skip Sunday (0) and Saturday (6)
//       result.push(new Date(current));
//     }
//     current.setDate(current.getDate() + 1);
//   }

//   return result;
// };

//   const workingDates = generateWorkingDates();
//   console.log("Working Dates: ");
//   workingDates.map((d) => console.log(d.getDay()))
  
//   useEffect(() => {
//   const token = localStorage.getItem('jwt');
//   if (!token) {
//     navigate('/DoctorLogin');
//     return;
//   }

//   const fetchData = () =>
//     fetch(`${BASE_URL}/api/admin/getAppointments`, {
//       method: 'GET',
//       headers: { 
//         Authorization: `Bearer ${token}`
//       },
//     })
//       .then(r => r.json())
//       .then(data => {
//         console.log(data);
        
//         const filtered = data.appointments.filter(
//           a => workingDates.includes(a.date)
//         );
//         setAppointments(filtered);
//         console.log("Filtered: " + filtered);
        
//         setLoading(false);
//       })
//       .catch(console.error);

//     fetchData();                           
// }, [navigate, window.location.reload]);


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="doctor-info">
          <h1>Doctor Dashboard</h1>
          <p><strong>Name:</strong> {doctorInfo?.name}</p>
          {/* <p><strong>Email:</strong> {doctorInfo?.email}</p> */}
        </div>
        <button className="logout-button" onClick={logOut}>Log Out</button>
      </header>

      <div>
        <SlotMatrix />
      </div>
      
    </div>
  );
};

export default DoctorDashboard;
