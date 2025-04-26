import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import ErrorBlock from '../Components/ErrorBlock';
import eyeClose from './images/eye-close.png'
import eyeOpen from './images/eye-open.png'
import './SignUp.css'

function SignUp() {
    const[showError, setShowError] = useState(false);

    const userRef = useRef();
    const inputRef1 = useRef();
    const inputRef2 = useRef();
    const eyeRef1 = useRef();
    const eyeRef2 = useRef();

    const navigate = useNavigate();

    function toggle(field, e){

        console.log(field);
        
        if(field === "Pass"){
            const isPassword = inputRef1.current.type === "password";
            inputRef1.current.type = isPassword ? "text" : "password";
            eyeRef1.current.src = isPassword ? eyeOpen : eyeClose;
        } else {
            const isPassword = inputRef2.current.type === "password";
            inputRef2.current.type = isPassword ? "text" : "password";
            eyeRef2.current.src = isPassword ? eyeOpen : eyeClose;
        }
    }

    async function validate(){

        const password = inputRef1.current.value.trim();
        const confirm = inputRef2.current.value.trim();
        
        if(password !== confirm){
            const errorBorder = "2px solid red";
            inputRef2.current.style.border = errorBorder; 
            inputRef1.current.style.border = errorBorder; 
            
            setShowError(true);
            return;
        }
        // if passwords matches
        // setting the username and password
        
        const Username = userRef.current.value;
        try{
            const response = await fetch("http://127.0.0.1:10001/SignUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({Username})
            })

            if(response.ok){
                const okMsg = await response.json();
                alert(JSON.stringify(okMsg.msg));
                // sets the username and password in local storage
                localStorage.setItem("Username", Username);
                localStorage.setItem("Password", password);
                navigate("/PatientDetails");
                console.log(JSON.stringify(okMsg.msg));
                return;
            }

            const notOK = await response.json();
            alert(JSON.stringify(notOK.msg));

            console.log(JSON.stringify(notOK.msg));
            

        } catch(error){
            console.log("error: " + error);
        }

        // alert("Successfully submitted!!!")
        // localStorage.setItem("Username", Username);
        // localStorage.setItem("Password", password);
    }
    
    
    return(
        <main className='' >
            <div className="container">
                <div className='heading'>Sign Up</div>
                <input type="text" ref={userRef} placeholder="Username" id="" />

                <div className="pass-container">
                    <input ref={inputRef1} className="inPass" id='Pass'
                    placeholder='Password' type="password" required/>
                    
                    <button onClick={(e) => toggle("Pass", e)} className='eye'>
                        <img src={eyeClose} className="" ref={eyeRef1} alt="" />
                    </button>
                </div>

                <div className="pass-container">
                    <input ref={inputRef2} className="inPass" id='confirmPass' placeholder='Confirm Password' type="password" required/>
                    <button onClick={(e) => toggle("confirmPass", e)} className='eye'>
                        <img src={eyeClose} className="" ref={eyeRef2} alt="" />
                    </button>
                </div>

                <button type="submit" className='subBtn' onClick={validate}>Submit</button>
                
                <div id='have-acc-signup'>Already Have an Account?
                        <Link to="/" id='login'> Login </Link>
                </div>

                {showError && <ErrorBlock message="Passwords Don't Match!!" code="401" />}
                <ErrorBlock message="Passwords Don't Match!!" /> 

            </div>

        </main>
    )
}

export default SignUp;