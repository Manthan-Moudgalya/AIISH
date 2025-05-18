import { useState, useEffect, useMemo } from 'react';

const timeSlots = [
  '09:00 - 09:45 AM', '09:45 - 10:30 AM', '10:30 - 11:15 AM', '11:30 - 12:15 PM',
  '12:15 - 1:00 PM', '02:00 - 02:45 PM', '02:45 - 03:30 PM', '03:45 - 04:30 PM', '04:30 - 05:15 PM'
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

// Convert appointments to matrix
const convertToMatrix = (appointments) => {
  const matrix = {};

  appointments.forEach(({ date, time, patientName, disorderType, status, createdAt, _id }) => {
    const normalizedDate = formatToYMD(date);
    if (!normalizedDate) {
      console.warn('Invalid date found:', date);
      return;
    }
    const index = timeSlots.findIndex(slot => slot === time);
    if (index === -1) {
      console.warn('Invalid time slot:', time);
      return;
    }

    if (!matrix[normalizedDate]) matrix[normalizedDate] = {};
    matrix[normalizedDate][index] = { patientName, disorderType, status, createdAt, _id };
  });

  return matrix;
};

const SlotMatrix = () => {
  const dates = getWorkingDates();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const token = localStorage.getItem('jwt');

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
  const appointmentsMatrix = useMemo(() => convertToMatrix(appointments), [appointments]);

  const handleCellClick = (date, slotIndex, appointmentInfo) => {
    if (appointmentInfo) {
      setSelectedAppointment({
        date,
        time: timeSlots[slotIndex],
        ...appointmentInfo
      });
    } else {
      setSelectedAppointment(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading appointment data...
      </div>
    );
  }

  if (!appointments.length && !error) {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
            <div className="font-medium text-gray-700">Created At:</div>
            <div>{formatTimestamp(selectedAppointment.createdAt)}</div>
            <div className="font-medium text-gray-700">Appointment ID:</div>
            <div>{selectedAppointment._id}</div>
          </div>
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
