import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import eyeClose from './images/eye-close.png'
import eyeOpen from './images/eye-open.png'
import './Login.css'
// import dotenv from 'dotenv';

// dotenv.config();


function Login() {

    const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
    const PhoneNumberRef = useRef();
    const PasswordRef = useRef();
    const eyeRef = useRef();
    const phoneNumLen = 10;
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "AIISH Login";
    }, []); 
    

    function toggle(e){
        e.preventDefault();
        if(PasswordRef.current.type === "password"){
            PasswordRef.current.type = "text"
            eyeRef.current.src = eyeOpen;
        } else {
            eyeRef.current.src = eyeClose;
            PasswordRef.current.type = "password"
        }
    }

    async function sendRequest() {
        const PhoneNumber = PhoneNumberRef.current.value;
        const Password = PasswordRef.current.value;
        const cleanedPhoneNum = PhoneNumber.replace(/\D/g, '');
        const phoneNumValid = cleanedPhoneNum.length === phoneNumLen ;
        
        if(!phoneNumValid){
            alert("Enter Valid phone number")
            return;
        }
        
        
        try{
            const response = await fetch(`${BASE_URL}/api/Login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({  PhoneNumber: `${PhoneNumber}`,
                                Password: `${Password}`
                }) 
            })
            
            const data = await response.json(); // ✅ only once

            if (!response.ok) {
                console.log("Error: " + data.msg);
                alert(data.msg);
                return;
            }

            try {
                console.log(data.token);
                console.log(JSON.stringify(data.patient));

                localStorage.setItem('token', data.token);
                localStorage.setItem('patient', JSON.stringify(data.patient));
            } catch (err) {
                console.error("localStorage error:", err);
            }   

            // alert(data.msg);
            navigate("/HomePage");

        } catch(error){
            console.log(`Error: ${error}`);
        }

    }


    return (
        <main>
            <form className="container">
                <div className="heading">Login</div>
                <input type="text" placeholder={"Phone Number"} ref={PhoneNumberRef} maxLength={phoneNumLen} minLength={phoneNumLen} required/>

                <div className="pass-container">
                    <input ref={PasswordRef} className="inPass" placeholder='Password' type="password" required/>
                    <button onClick={toggle} className='eye'>
                        <img src={eyeClose} className="" ref={eyeRef} alt="" />
                    </button>
                </div>
                <div className="controls">
                    <div id='have-acc-login'>Don't have an Account?
                        <Link to="/SignUp" id='sign-up'> Sign UP </Link>
                    </div>
                    <div id='have-acc-login'> Doctor?
                        <Link to="/DoctorSignup" id='sign-up'> Sign UP </Link>
                    </div>

                    <div id='have-acc-login'> Admin?
                        <Link to="/AdminLogin" id='sign-up'> Sign UP </Link>
                    </div>
                </div>

                <button type="submit" className='subBtn' onClick={(e) => {
                    e.preventDefault();
                    sendRequest();}}> Submit</button>
            </form>
        </main>
    )
  
}

export default Login; // ES6 -> version of js 