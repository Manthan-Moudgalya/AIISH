import { useRef } from 'react';
import { Link } from 'react-router-dom';

import eyeClose from './images/eye-close.png'
import eyeOpen from './images/eye-open.png'
import './Login.css'



function Login() {

    const UsernameRef = useRef();
    const PasswordRef = useRef();
    const eyeRef = useRef();


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
        const Username = UsernameRef.current.value;
        const Password = PasswordRef.current.value;
        // console.log(Username, Password);
        
        try{
            const response = await fetch("http://127.0.0.1:10001/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({  Username: `${Username}`,
                                Password: `${Password}`
                }) 
            })
            
            alert("Response given!!!")
            const data = await response.json(); 
            console.log("Data: " + data.msg);
            

        } catch(error){
            console.log(`Error: ${error}`);
        }

    }


    return (
        <main>
            <form className="container">
                <div className="heading">Login</div>
                <input type="text" placeholder={"Username"} ref={UsernameRef} required/>

                <div className="pass-container">
                    <input ref={PasswordRef} className="inPass" placeholder='Password' type="password" required/>
                    <button onClick={toggle} className='eye'>
                        <img src={eyeClose} className="" ref={eyeRef} alt="" />
                    </button>
                </div>
                <div className="controls">
                    {/* <span id='forget-text'>Forgot Password</span> */}
                    <div id='have-acc-login'>Don't have an Account?
                        <Link to="/SignUp" id='sign-up'> Sign UP </Link>
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