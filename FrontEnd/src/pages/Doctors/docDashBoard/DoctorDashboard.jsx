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

  const handleTherapy = () => {
    navigate("/PatientOverviewPage");
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="doctor-info">
          <p><strong>Name:</strong> {doctorInfo?.name}</p>
        </div>
        <div className="heading flex justify-center align-center">
            <span className='text-[.75em] font-semibold'>Doctor Dashboard</span>
        </div>
        <button className="bg-blue-700 p-2 rounded-[5px] mr-[20px]" onClick={handleTherapy}>Pre-Post-Therapy</button>
        <button className="logout-button" onClick={logOut}>Log Out</button>
      </header>

      <div>
        <SlotMatrix />
      </div>
      
    </div>
  );
};

export default DoctorDashboard;
