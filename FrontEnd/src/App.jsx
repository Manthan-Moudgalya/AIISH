import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Auth/Login/Login'
import SignUp from './Auth/SignUp/SignUp'
import PatientDetails from './Auth/PatientDetails/PatientDetails'
import Home from './Main/home';

function App() {
    return (
    <Router>
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/PatientDetails" element={<PatientDetails />} />
        <Route path="/Main" element={<Home/>} />
        </Routes>
    </Router>
    );
    
}

export default App