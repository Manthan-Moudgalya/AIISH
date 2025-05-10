import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Auth/Login/Login'
import SignUp from './Auth/SignUp/SignUp'
import PatientDetails from './Auth/PatientDetails/PatientDetails'
import Home from './Main/home.jsx'
import './App.css'

function App() {
    return (
    <Router>
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/PatientDetails" element={<PatientDetails />} />
        <Route path="/HomePage" element={<Home/>} />
        </Routes>
    </Router>
    );
    
}

export default App