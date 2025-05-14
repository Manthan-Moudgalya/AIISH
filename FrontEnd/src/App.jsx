import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Auth/Login/Login'
import SignUp from './Auth/SignUp/SignUp'
import Home from './Main/home.jsx'
import PatientDetails from './Auth/PatientDetails/PatientDetails'
import PatientDashboard from './patientDashboard/patientDashboard';
import './App.css'

function App() {
    return (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/PatientDetails" element={<PatientDetails />} />
            <Route path="/HomePage" element={<Home/>} />
            <Route path="/patientDashboard" element={<PatientDashboard/>} />
        </Routes>
    </Router>
    );
}

export default App