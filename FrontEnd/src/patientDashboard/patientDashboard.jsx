import { useState } from 'react';
import './PatientDashboard.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, getDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDisorder, setSelectedDisorder] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const timeSlots = [
    '09:00 - 09:45 AM', '9:45 - 10:30 AM', '10:30 - 11:15 AM', '11:30 - 12:15 PM', '12:15 - 1:00 PM',
    '02:00 - 02:45 PM', '02:45 - 3:30 PM', '03:45 - 4:30 PM', '04:30 - 5:15 PM'
  ];
  
  const disorderTypes = [
    'First visit',
    'Articulation Problem',
    'Language Problem',
    'Cognitive-Communication Problem',
    'Social Communication Problem',
    'Speech Impairments Problem',
    'Swallowing Problem',
    'Voice Problem'
  ];

  // Base URL for API requests - replace with your actual base URL
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');
    
    // Form validation
    if (!selectedDate || !selectedTime || !selectedDisorder) {
      setError('Please select date, time, and disorder type.');
      return;
    }
    
    try {
      // Get patient name from localStorage
      const patientData = localStorage.getItem('patient');
      
      if (!patientData) {
        setError('Patient information not found. Please log in again.');
        return;
      }
      
      // Parse the patient JSON object from localStorage
      const patient = JSON.parse(patientData);
      
      if (!patient.name) {
        setError('Patient name not found. Please update your profile.');
        return;
      }

      const formatToYMD = (date) => {
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };

      
      // Prepare appointment data
      const appointmentData = {
        patientName: patient.name,
        date: formatToYMD(selectedDate),
        time: selectedTime,
        disorderType: selectedDisorder
      };
      
      // Send appointment request to the server
      setIsLoading(true);
      
      try {

        console.log(appointmentData);
        
        const response = await fetch(`${BASE_URL}/api/admin/appointments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(appointmentData)
        });
        
        const data = await response.json();
        
        setIsLoading(false);
        
        if (response.ok && data.success) {
          // Process payment (this would typically be handled by a payment gateway)
          // For this example, I'm just setting payment as done
          setPaymentDone(true);
          
          // Provide feedback to the user
          alert('Appointment Requested Successfully!');
          
          // Optional: Navigate to a confirmation page or appointment list
          navigate('/HomePage', { replace: true });
        } else {
          // Server returned an error
          setError(`Booking failed: ${data.message || 'Unknown error occurred'}`);
        }
      } catch (error) {
        setIsLoading(false);
        setError('Network error. Please check your internet connection.');
        console.error('Appointment booking error:', error);
      }
    } catch (error) {
      setIsLoading(false);
      
      // Handle different error scenarios
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        setError(`Error: ${error.response.data.message || 'Something went wrong'}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError('Network error. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setError(`Error: ${error.message}`);
      }
      
      console.error('Appointment booking error:', error);
    }
  };

  return (
    <div className="patient-dashboard">
      <h2 className="text-xl font-semibold mb-4">Schedule an Appointment</h2>
      
      {error && (
        <div className="error-message text-red-600 mb-4 p-2 bg-red-100 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label className='label'>Select Date:</label>
          <DatePicker
            className="date-picker-input"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            maxDate={addDays(new Date(), 20)}
            filterDate={(date) => {
              const day = getDay(date);
              return day !== 0 && day !== 6;
            }}
            placeholderText="Choose a weekday"
          />
        </div>
        
        <div className="form-group">
          <label className='label'>Select Time:</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className='text-center'
          >
            <option>-- Select Time --</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className='label'>Appointment Type:</label>
          <select
            value={selectedDisorder}
            onChange={(e) => setSelectedDisorder(e.target.value)}
            className='text-center'
          >
            <option value="">-- Select Problem Type --</option>
            {disorderTypes.map((disorder) => (
              <option key={disorder} value={disorder}>{disorder}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Payment:</label>
          {paymentDone ? (
            <p className="text-green-600">✅ Payment Completed</p>
          ) : (
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Book Appointment'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PatientDashboard;
