import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const timeSlots = [
  '09:00 - 09:45 AM', '09:45 - 10:30 AM', '10:30 - 11:15 AM', '11:30 - 12:15 PM',
  '12:15 - 01:00 PM', '02:00 - 02:45 PM', '02:45 - 03:30 PM', '03:45 - 04:30 PM',
  '04:30 - 05:15 PM'
];

const appointmentStatusColors = {
  confirmed: '#4CAF50',
  appointed: '#4A90E2',
  scheduled: '#FFC107',
  pending: '#FF5722',
  available: '#F5F5F5'
};

// Format date to YYYY-MM-DD
const formatToYMD = (date) => {
  if (!date) return null;

  let d;
  // Check if date matches DD-MM-YYYY format (e.g., 29-05-2025)
  const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (typeof date === 'string' && ddmmyyyyRegex.test(date)) {
    const [day, month, year] = date.split('-');
    // Create date in YYYY-MM-DD format for proper parsing
    d = new Date(`${year}-${month}-${day}`);
  } else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
};

// Generate 20 working days (excluding weekends)
const getWorkingDates = () => {
  const current = new Date();
  const result = [];
  const count = 20;

  while (result.length < count) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      result.push(formatToYMD(new Date(current)));
    }
    current.setDate(current.getDate() + 1);
  }
  return result;
};

// Format date for display (e.g., "Mon, May 19, 2025")
const formatDisplayDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

// Format timestamp for display (e.g., "May 16, 2025, 5:08 PM")
const formatTimestamp = (timestamp) => {
  const d = new Date(timestamp);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
};

// Get day name (e.g., "Mon")
const getDayName = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
};

// Normalize time slot to handle single-digit hours
const normalizeTimeSlot = (time) => {
  if (!time) return time;
  // Normalize single-digit hours to two-digit (e.g., 5:15 PM -> 05:15 PM)
  return time.replace(
    /(\d{1,2}):(\d{2}\s*-\s*)(\d{1,2}):(\d{2}\s*[AP]M)/,
    (match, h1, m1, h2, m2) => {
      return `${h1.padStart(2, '0')}:${m1}${h2.padStart(2, '0')}:${m2}`;
    }
  );
};


// Convert appointments to matrix
const convertToMatrix = (appointments, setInvalidAppointments) => {
  const matrix = {};
  const invalidAppointments = [];

  appointments.forEach(({ date, time, patientName, disorderType, status, createdAt, _id }) => {
    const normalizedDate = formatToYMD(date);
    if (!normalizedDate) {
      console.warn('Invalid date found:', date);
      invalidAppointments.push({ date, time, patientName, _id });
      return;
    }
    const normalizedTime = normalizeTimeSlot(time?.trim());
    const index = timeSlots.findIndex(slot => slot === normalizedTime);
    if (index === -1) {
      console.warn('Invalid time slot:', time, 'Normalized:', normalizedTime);
      invalidAppointments.push({ date, time, patientName, _id });
      return;
    }

    if (!matrix[normalizedDate]) matrix[normalizedDate] = {};
    matrix[normalizedDate][index] = { patientName, disorderType, status, createdAt, _id };
  });

  if (invalidAppointments.length > 0) {
    console.log('Invalid appointments:', invalidAppointments);
    setInvalidAppointments(invalidAppointments);
  }

  return matrix;
};

const SlotMatrix = () => {
  const dates = getWorkingDates();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [invalidAppointments, setInvalidAppointments] = useState([]);
  const token = localStorage.getItem('jwt');
  const sectionRef = useRef();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/medicalRecords');
  };

//   const scrollToSection = () => {
//     sectionRef.current?.scrollIntoView({ behavior: "smooth" });
//   };


  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      

      try {
        setLoading(true);
        const doctorStr = localStorage.getItem('doctor');
        if (!doctorStr) {
          throw new Error("No Doctor Name");
        }
        const doctor = JSON.parse(doctorStr);
        const doctorName = doctor?.name;

        if (!doctorName) throw new Error("Doctor name missing");

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/doctor/getAppointments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ doctorName })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `HTTP error! Status: ${response.status}`);
        }

        console.log('Raw appointments data:', data.appointments);
        setAppointments(data.appointments || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message || 'Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  // Memoize the appointments matrix
  const appointmentsMatrix = useMemo(() => convertToMatrix(appointments, setInvalidAppointments), [appointments]);

    const handleCellClick = (date, slotIndex, appointmentInfo) => {
        if (appointmentInfo) {
        setSelectedAppointment({
            date,
            time: timeSlots[slotIndex],
            ...appointmentInfo
        });
        window.location.href = "#sectionRef";

        } else {
        setSelectedAppointment(null);
        }
    };

  const handleSharedNotes = () => {
    navigate("/SharedNotes");
  }

  const handleRecordings= () => {
    window.location.href = "https://aiish-zoom.vercel.app/";
  }


  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading appointment data...
      </div>
    );
  }

  if (!appointments.length && !error && !invalidAppointments.length) {
    return (
      <div className="p-4 text-center text-gray-600">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-full">
      {error && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
          {error}
        </div>
      )}

      {invalidAppointments.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p>Warning: {invalidAppointments.length} appointments have invalid dates or time slots and are not displayed.</p>
          <ul className="list-disc pl-5">
            {invalidAppointments.map((app, idx) => (
              <li key={idx}>
                {app.patientName} on {app.date} at {app.time} (ID: {app._id})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left w-40 sticky left-0 bg-gray-100 z-10">Date</th>
              {timeSlots.map((slot, index) => (
                <th key={index} className="border border-gray-300 p-3 text-center">{slot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dates.map(date => (
              <tr key={date}>
                <td className="border border-gray-300 p-3 bg-gray-50 font-medium sticky left-0 z-10">
                  <div className="font-bold">{getDayName(date)}</div>
                  <div className="text-xs text-gray-600">{formatDisplayDate(date)}</div>
                </td>
                {timeSlots.map((_, slotIndex) => {
                  const appointmentInfo = appointmentsMatrix[date]?.[slotIndex];
                  const status = appointmentInfo?.status || 'available';

                  return (
                    <td
                      key={`${date}-${slotIndex}`}
                      className="border border-gray-300 p-3 text-center cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: appointmentStatusColors[status] }}
                      onClick={() => handleCellClick(date, slotIndex, appointmentInfo)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCellClick(date, slotIndex, appointmentInfo)}
                      tabIndex={0}
                      role="button"
                    >
                      <div className="text-xs font-medium truncate" style={{ color: status === 'available' ? '#6B7280' : '#FFFFFF' }}>
                        {appointmentInfo ? appointmentInfo.patientName : 'Available'}
                      </div>

                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAppointment && (
        <div className="mt-6 p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Appointment Details</h3>
                <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setSelectedAppointment(null)}
                >
                Close
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm" id="sectionRef">
                <div className="font-medium text-gray-700">Date:</div>
                <div>{formatDisplayDate(selectedAppointment.date)}</div>
                <div className="font-medium text-gray-700">Time:</div>
                <div>{selectedAppointment.time}</div>
                <div className="font-medium text-gray-700">Patient:</div>
                <div>{selectedAppointment.patientName}</div>
                <div className="font-medium text-gray-700">Disorder Type:</div>
                <div>{selectedAppointment.disorderType || 'N/A'}</div>
                <div className="font-medium text-gray-700">Status:</div>
                <div className="capitalize">{selectedAppointment.status}</div>
            </div>

            <button
                onClick={handleClick}
                className='mt-[20px]'
                style={{
                    backgroundColor: '#add8e6', // light blue
                    color: '#000',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'semibold', 
                    marginRight: "15px"
                }}
                >
                Create Record
            </button>

            <button
                onClick={handleSharedNotes}
                className='mt-[20px]'
                style={{
                    backgroundColor: '#add8e6', 
                    color: '#000',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'semibold',
                    marginRight: "15px"
                }}
                >
                Shared Notes
            </button>

            <button
                onClick={handleRecordings}
                className='mt-[20px]'
                style={{
                    backgroundColor: '#add8e6', 
                    color: '#000',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'semibold'
                }}
                >
                Recordings
            </button>

        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-4">
        {Object.entries(appointmentStatusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
            <span className="text-sm capitalize text-gray-700">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotMatrix;
