import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ title }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (title === 'Scheduling Appointment') {
        navigate('/patientDashboard'); 
    } else if( title === "Medical History"){
        navigate('/PatientOverviewPage'); 
    } else if (title === 'Wellness Tips'){
        navigate('/WellnessTips')
    } else if(title === "Shared Notes"){
        navigate('/SharedNotes')
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
    >
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2">Explore and manage your {title.toLowerCase()}.</p>
    </div>
  );
};

export default Card;
