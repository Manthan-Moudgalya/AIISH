import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Auth/Login/Login'
import SignUp from './Auth/SignUp/SignUp'
import Home from './Main/home.jsx'
import PatientDetails from './Auth/PatientDetails/PatientDetails'
import PatientDashboard from './patientDashboard/patientDashboard';
import DoctorLogin from './pages/Doctors/DoctorLogin.jsx';
import DoctorSignup from './pages/Doctors/DoctorSignup.jsx';
import DoctorDashBoard from './pages/Doctors/docDashBoard/DoctorDashboard.jsx'
import AdminLogin from './pages/Admin/AdminLogin.jsx';
import AdminDashboard from './pages/Admin/AdminDashBoard/AdminDashboard.jsx';
import PatientOverviewPage from './Main/PatientOverviewPage.jsx';
import WellnessTips from './Main/WellnessTips.jsx';
import SharedNotes from './Main/Components/SharedNotes.jsx'

function App() {
    return (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/PatientDetails" element={<PatientDetails />} />
            <Route path="/HomePage" element={<Home/>} />
            <Route path="/PatientDashboard" element={<PatientDashboard/>} />
            <Route path="/PatientOverviewPage" element={<PatientOverviewPage/>} />
            <Route path="/WellnessTips" element={<WellnessTips/>} />
            <Route path="/SharedNotes" element={<SharedNotes/>} />

            <Route path="/DoctorSignup" element={<DoctorSignup/>} />
            <Route path="/DoctorLogin" element={<DoctorLogin/>} />
            <Route path="/DoctorDashBoard" element={<DoctorDashBoard/>} />

            <Route path="/AdminLogin" element={<AdminLogin/>} />
            <Route path="/AdminDashboard" element={<AdminDashboard/>} />

        </Routes>
    </Router>
    );
}

export default App