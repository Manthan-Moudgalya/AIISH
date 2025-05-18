import { useState, useEffect } from 'react';
import { Clock, User, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctors, setSelectedDoctors] = useState({});

  const navigate = useNavigate();

  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

  const formatDate = (iso) => {
    const [year, month, day] = iso.slice(0, 10).split("-");
    const formatted = `${day}-${month}-${year}`;
    return formatted;
  };

  // Fetch appointments and doctors data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get the JWT token from localStorage
        const token = localStorage.getItem('jwt');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await fetch(`${BASE_URL}/api/admin/getAppointments`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'GET'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch appointments data');
        }
        const data = await response.json();
        setPatients(data.appointments);
        setDoctors(data.doctors);
        setLoading(false);
        
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const rejectAppointment = async (patientName) => {
    // console.log("Here" ,patientName);

    try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/admin/rejectAppointment`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({patientName})
        })

        const data = await response.json();

        if(!response.ok){
            alert(data.msg);
            setLoading(false)
            return;
        }

        fetchData();
        window.location.reload();

    } catch (error) {
        setError(error.msg);
        setLoading(false)
    }
    
    // setPatients(prev => prev.filter(p => p.patientName !== patientName));
  };

  // Handle selection of doctor in dropdown
  const handleDoctorSelection = (patientName, doctorName) => {
    setSelectedDoctors(prev => ({
      ...prev,
      [patientName]: doctorName
    }));
  };

  // Assign doctor when the button is clicked
  const assignDoctor = async (patientObj) => {
    const doctorName = selectedDoctors[patientObj.patientName];
    
    console.log("Doctor Name: " + doctorName);
    console.log(JSON.stringify(patientObj, null, 2));
        

    if (!doctorName) {
      alert("Please select a doctor first");
      return;
    }

    const token = localStorage.getItem('jwt');
    if (!token) {
      setError('Authentication token not found');
      navigate('/AdminLogin', { replace: true });
      return;
    }

    try {
      // Get the full doctor object to send more details if needed
      const selectedDoctor = doctors.find(doc => doc.name === doctorName);
      
      if (!selectedDoctor) {
        throw new Error('Selected doctor not found');
      }
      
      const res = await fetch(`${BASE_URL}/api/admin/assignDoctor`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: patientObj.patientName,
          appointmentTime: patientObj.time,
          appointmentDate: formatDate(patientObj.date),
          patientReason: patientObj.reason || '',
          disorderType: patientObj.disorderType || '',
          doctorName: doctorName, // Use the name consistently
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to assign doctor');
      }

      // Remove patient from UI after successful backend confirmation
      setPatients(prev => prev.filter(p => p.patientName !== patientObj.patientName));
      
      // Also clear the selection
      const newSelections = {...selectedDoctors};
      delete newSelections[patientObj.patientName];
      setSelectedDoctors(newSelections);

      alert(`Successfully assigned ${patientObj.patientName} to Dr. ${doctorName}`);
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  const logOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('admin');
    navigate("/AdminLogin",{ replace: true });
    window.location.reload();
  };

  // Function to check if a doctor is available on a specific date and time
  const isDoctorAvailable = (doctor, date, time) => {
    // If doctor has no appointments array or it's empty, they're available
    if (!doctor.appointments || doctor.appointments.length === 0) return true;
    
    // Check if doctor is already booked at the specified date and time
    const conflictingAppointment = doctor.appointments.find(appointment => {
      // Exact match for date
      if (appointment.date !== date) return false;
      
      // For time, we need to handle different time formats
      // Some appointments might be "09:00 AM" while others might be "09:00 - 09:45 AM"
      const appointmentTime = appointment.time.split(' - ')[0].trim(); // Get start time if it's a range
      const appointmentTimeNormalized = appointmentTime.replace(/\s+/g, ' ').trim(); // Normalize whitespace
      const patientTimeNormalized = time.replace(/\s+/g, ' ').trim(); // Normalize whitespace
      
      // Compare normalized time strings
      return appointmentTimeNormalized === patientTimeNormalized;
    });
    
    // Doctor is available if no conflicting appointment is found
    return !conflictingAppointment;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading appointments data...</div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-xl text-red-500">Error: {error}</div>
        </div>
    );
  }

  return (
    <div className='hello'>
      <header className="dashboard-header">
        <div className="admin-info">
          <h1>Admin Dashboard</h1>
        </div>
        <button className="logout-button" onClick={logOut}>Log Out</button>
      </header>
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        
        {/* Patients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disorder Type</th>
              
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.length > 0 ? patients.map((patient) => (
                <tr key={patient.patientName}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-500" />
                      <div className="text-sm font-medium text-gray-900">{patient.patientName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(patient.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-gray-500" />
                      <div className="text-sm text-gray-900">{patient.time}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.disorderType}</div>
                  </td>
        
                  <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2">
                    <select 
                      className="text-sm border border-gray-300 rounded p-1"
                      value={selectedDoctors[patient.patientName] || ""}
                      onChange={(e) => handleDoctorSelection(patient.patientName, e.target.value)}
                    >
                      <option value="">Select Doctor</option>
                      {doctors.filter(doctor => {
                        // Filter doctors by type if patient has disorder type preference
                        if (patient.disorderType && doctor.doctorType) {
                          // Simple matching - can be expanded with more sophisticated matching
                          const disorderLower = patient.disorderType.toLowerCase();
                          const doctorTypeLower = doctor.doctorType.toLowerCase();
                          
                          // Only include doctors whose type matches the patient's disorder
                          if (!doctorTypeLower.includes('speech') && disorderLower.includes('speech')) {
                            return false;
                          }
                          // Add more matching logic here if needed
                        }
                        
                        // Check if doctor is available at requested time
                        return isDoctorAvailable(doctor, patient.date, patient.time);
                      }).map((doctor) => (
                        <option key={doctor.name} value={doctor.name}>
                          {doctor.name} ({doctor.doctorType})
                        </option>
                      ))}
                    </select>
                    
                    <button 
                      onClick={() => assignDoctor(patient)}
                      disabled={!selectedDoctors[patient.patientName]}
                      className={`px-3 py-1 rounded text-white text-sm ${
                        selectedDoctors[patient.patientName] 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      Assign
                    </button>
                    
                    <button 
                      onClick={() => rejectAppointment(patient.patientName)}
                      className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                      title="Reject Appointment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No appointment requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold">Total Appointments</h3>
            <p className="text-3xl font-bold mt-2">{patients.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold">Pending Assignments</h3>
            <p className="text-3xl font-bold mt-2">
              {patients.filter(p => !p.assignedDoctor).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold">Available Doctors</h3>
            <p className="text-3xl font-bold mt-2">{doctors.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
