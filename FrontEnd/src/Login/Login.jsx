import { useRef } from 'react';
import eyeClose from './images/eye-close.png'
import eyeOpen from './images/eye-open.png'

import './Login.css'


function Login() {

    const inputRef = useRef();
    const eyeRef = useRef();

    function toggle(e){
        e.preventDefault();
        if(inputRef.current.type === "password"){
            inputRef.current.type = "text"
            eyeRef.current.src = eyeOpen;
        } else {
            eyeRef.current.src = eyeClose;
            inputRef.current.type = "password"
        }
    }



    return (
        <form className="container">
            <div className="heading">Login</div>
            <input type="email" placeholder={"Email"} required/>

            <div className="pass-container">
                <input ref={inputRef} className="inPass" placeholder='Password' type="password" required/>
                <button onClick={toggle} className='eye'>
                    <img src={eyeClose} className="" ref={eyeRef} alt="" />
                </button>
            </div>

            <button type="submit" className='subBtn'>Submit</button>
        </form>
    )
  
}

export default Login; // ES6 -> version of js 