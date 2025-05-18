import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorBlock from '../Components/ErrorBlock';
import eyeClose from './images/eye-close.png';
import eyeOpen from './images/eye-open.png';
import './SignUp.css';

function SignUp() {
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
  const phoneNumLen = 10;

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userRef = useRef();
  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const eyeRef1 = useRef();
  const eyeRef2 = useRef();
  const patientNameRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "AIISH SignUP";
  }, []);

  function toggle(field) {
    if (field === "Pass") {
      const isPassword = inputRef1.current.type === "password";
      inputRef1.current.type = isPassword ? "text" : "password";
      eyeRef1.current.src = isPassword ? eyeOpen : eyeClose;
    } else {
      const isPassword = inputRef2.current.type === "password";
      inputRef2.current.type = isPassword ? "text" : "password";
      eyeRef2.current.src = isPassword ? eyeOpen : eyeClose;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const password = inputRef1.current.value.trim();
    const confirm = inputRef2.current.value.trim();
    const phone = userRef.current.value.trim();
    const name = patientNameRef.current.value.trim();

    // Reset error state
    setShowError(false);
    setErrorMessage("");

    if (password !== confirm) {
      inputRef1.current.style.border = "2px solid red";
      inputRef2.current.style.border = "2px solid red";
      setShowError(true);
      setErrorMessage("Passwords don't match!");
      return;
    }

    const cleanedPhoneNum = phone.replace(/\D/g, '');
    if (cleanedPhoneNum.length !== phoneNumLen) {
      alert("Enter a valid 10-digit phone number.");
      return;
    }

    if (name.length < 4) {
      alert("Enter a proper full name (min 4 characters).");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/SignUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPhoneNumber: cleanedPhoneNum }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("userPhoneNumber", cleanedPhoneNum);
        localStorage.setItem("Password", password);
        localStorage.setItem("patientName", name);
        alert(result.msg);
        navigate("/PatientDetails");
      } else {
        alert(result.msg);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <main>
      <div className="container">
        <div className="heading">Sign Up</div>

        <form id='signUpForm'onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Phone Number"
            ref={userRef}
            maxLength={phoneNumLen}
            minLength={phoneNumLen}
            required
          />

          <input
            type="text"
            placeholder="Enter Full name"
            ref={patientNameRef}
            maxLength={50}
            minLength={4}
            required
          />

          <div className="pass-container">
            <input
              ref={inputRef1}
              className="inPass"
              id="Pass"
              placeholder="Password"
              type="password"
              required
            />
            <button type="button" onClick={() => toggle("Pass")} className="eye">
              <img src={eyeClose} ref={eyeRef1} alt="Toggle visibility" />
            </button>
          </div>

          <div className="pass-container">
            <input
              ref={inputRef2}
              className="inPass"
              id="confirmPass"
              placeholder="Confirm Password"
              type="password"
              required
            />
            <button type="button" onClick={() => toggle("confirmPass")} className="eye">
              <img src={eyeClose} ref={eyeRef2} alt="Toggle visibility" />
            </button>
          </div>

          <button type="submit" className="subBtn">Submit</button>
        </form>

        <div id="have-acc-signup">
          Already Have an Account?
          <Link to="/" id="login"> Login </Link>
        </div>

        {showError && <ErrorBlock message={errorMessage} code="401" />}
      </div>
    </main>
  );
}

export default SignUp;

// import { useRef, useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";
// import ErrorBlock from '../Components/ErrorBlock';
// import eyeClose from './images/eye-close.png'
// import eyeOpen from './images/eye-open.png'
// import './SignUp.css'

// function SignUp() {

//     const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
//     const[showError, setShowError] = useState(false);

//     const userRef = useRef();
//     const inputRef1 = useRef();
//     const inputRef2 = useRef();
//     const eyeRef1 = useRef();
//     const eyeRef2 = useRef();
//     const patientNameRef = useRef();

//     const navigate = useNavigate();

//     const phoneNumLen = 10;

//     useEffect(() => {
//         document.title = "AIISH SignUP";
//     }, []); 
    
//     function toggle(field, e){

//         console.log(field);
        
//         if(field === "Pass"){
//             const isPassword = inputRef1.current.type === "password";
//             inputRef1.current.type = isPassword ? "text" : "password";
//             eyeRef1.current.src = isPassword ? eyeOpen : eyeClose;
//         } else {
//             const isPassword = inputRef2.current.type === "password";
//             inputRef2.current.type = isPassword ? "text" : "password";
//             eyeRef2.current.src = isPassword ? eyeOpen : eyeClose;
//         }
//     }

//     async function validate(){

//         console.log("Base URL: " + BASE_URL);

//         const password = inputRef1.current.value.trim();
//         const confirm = inputRef2.current.value.trim();
//         // console.log("name: " + patientName_)
//         if(password !== confirm){
//             const errorBorder = "2px solid red";
//             inputRef2.current.style.border = errorBorder; 
//             inputRef1.current.style.border = errorBorder; 
//             setShowError(true);
//             return;
//         }
//         const patientName = patientNameRef.current.value;

//         // if passwords matches
//         // setting the username and password

//         const PhoneNumber = userRef.current.value;
//         const cleanedPhoneNum = PhoneNumber.replace(/\D/g, '');
//         // const patientName = patientName_.replace(/\D/g, '');
//         console.log("patientName: " + patientName);
        
//         const phoneNumValid = cleanedPhoneNum.length === phoneNumLen ;
        
//         if(!phoneNumValid){
//             alert("Enter Valid phone number")
//             return;
//         }

//         if(patientName.length < 4){
//             alert(`Enter proper Name ${patientName}`);
//             console.log(`Enter proper Name ${patientName}`);
//             return;
//         }

//         const userPhoneNumber = cleanedPhoneNum
//         try{
//             const response = await fetch(`${BASE_URL}/api/SignUp`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 }, 
//                 body: JSON.stringify({userPhoneNumber})
//             })

//             if(response.ok){
//                 const okMsg = await response.json();
//                 alert(JSON.stringify(okMsg.msg));
//                 // sets the username and password in local storage
//                 localStorage.setItem("userPhoneNumber", userPhoneNumber);
//                 localStorage.setItem("Password", password);
//                 localStorage.setItem("patientName", patientName);
//                 navigate("/PatientDetails");
//                 console.log(JSON.stringify(okMsg.msg));
//                 return;
//             }

//             const notOK = await response.json();
//             alert(JSON.stringify(notOK.msg));

//             console.log(JSON.stringify(notOK.msg));
            

//         } catch(error){
//             console.log("error: " + error);
//         }

//     }
    
    
//     return(
//         <main className='' >
//             <div className="container">
//                 <div className='heading'>Sign Up</div>
//                 <input type="text" placeholder={"Phone Number"} ref={userRef} maxLength={phoneNumLen} minLength={phoneNumLen} required/>

//                 <input type="text"  placeholder='Enter Full name' maxLength={50} minLength={4}   
//                 ref={patientNameRef} required />

//                 <div className="pass-container">
//                     <input ref={inputRef1} className="inPass" id='Pass'
//                     placeholder='Password' type="password" required/>
                    
//                     <button onClick={(e) => toggle("Pass", e)} className='eye'>
//                         <img src={eyeClose} className="" ref={eyeRef1} alt="" />
//                     </button>
//                 </div>

//                 <div className="pass-container">
//                     <input ref={inputRef2} className="inPass" id='confirmPass' placeholder='Confirm Password' type="password" required/>
//                     <button onClick={(e) => toggle("confirmPass", e)} className='eye'>
//                         <img src={eyeClose} className="" ref={eyeRef2} alt="" />
//                     </button>
//                 </div>

//                 <button type="submit" className='subBtn' onSubmit={validate}>Submit</button>
                
//                 <div id='have-acc-signup'>Already Have an Account?
//                         <Link to="/" id='login'> Login </Link>
//                 </div>

//                 {showError && <ErrorBlock message="Passwords Don't Match!!" code="401" />}
//                 <ErrorBlock message="Passwords Don't Match!!" /> 

//             </div>

//         </main>
//     )
// }

// export default SignUp;