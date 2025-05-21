import './DoctorDashboard.css';
import { useNavigate } from "react-router-dom";
import SlotMatrix from './slotMatrix/slotMatrix';


const DoctorDashboard = () => {
  const navigate = useNavigate();

  const doctorInfo = JSON.parse(localStorage.getItem("doctor"));

  const logOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('doctor');
    navigate('/DoctorLogin', { replace: true })
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="doctor-info">
          <span className='text-[1em] font-medium'>Doctor Dashboard</span>
          <p><strong>Name:</strong> {doctorInfo?.name}</p>
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
