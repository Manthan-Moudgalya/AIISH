import {useRef, useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import './PatientDetails.css'

function PatientDetails() {
    const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

    const aadharLength = 12;
    const emailLenght = 30;

    const aadharRef = useRef();
    const emailRef = useRef();

    const lang1Ref = useRef();
    const lang2Ref = useRef();
    const lang3Ref = useRef();

    const incomeRef = useRef();
    const checkContainerRef = useRef();

    const[takeAudio, setAudio] = useState(false);
    const[takeSLP, setSLP] = useState(false);

    const navigate = useNavigate();

    function handleAudio(event){
        setAudio(event.target.checked);
    }

    useEffect(() => {
        document.title = "AIISH Details";
    }, []); 

    function handleSLP(e){
        setSLP(e.target.checked);
    }

    async function validate(){
        const aadharNumber = aadharRef.current.value;
        aadharRef.current.style.border = "none";
        checkContainerRef.current.style.border = "none";
        
        const cleanedAadharNum = aadharNumber.replace(/\D/g, '');
        const aadharValid = cleanedAadharNum.length === aadharLength ;

        if(aadharValid){
            // alert("Valid");
            const PhoneNumber = localStorage.getItem('userPhoneNumber')
            const Password = localStorage.getItem('Password')
            const patientName = localStorage.getItem("patientName");
            const email = emailRef.current.value;
            const lang1 = lang1Ref.current.value;
            const lang2 = lang2Ref.current.value;
            const lang3 = lang3Ref.current.value;
            const income = incomeRef.current.value;

            if(!takeAudio && !takeSLP){
                alert("Choose Atleast One");
                checkContainerRef.current.style.border = "3px solid red";
                checkContainerRef.current.style.borderRadius = "24px";
                return;
            }

            console.log(`${PhoneNumber} ${Password} \n${cleanedAadharNum}\n${email} 
                \n${lang1} ${lang2} ${lang3} \nIncome ${income}\n Audio: ${takeAudio} SLP: ${takeSLP}`);

            try{
                const response = await fetch(`${BASE_URL}/api/patientDetails`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        PhoneNumber, Password, cleanedAadharNum, email, lang1, lang2, lang3, 
                        totalIncome: income, patientName,
                        AudioLogist: takeAudio, SLPathologist: takeSLP
                    })
                })

                if(response.ok){
                    const data = await response.json();
                    alert(data.msg);
                    localStorage.removeItem("Password")
                    navigate("/HomePage")

                    return;
                }
                
                const data = await response.json(); 
                alert(data.msg);
                
            }
            catch(error){
                console.log("error: " + error);
            }
            return;
        }

        if(!aadharValid){
            aadharRef.current.style.border = "2px solid red";
            aadharRef.current.style.border= "2px solid red";
        }

        alert("Not Valid Inputs");
    }
    

    return(
        <main>
            <div id="container">
                <div id='container-heading'>Details</div>
                <input type="text" id="aadhar" ref={aadharRef} placeholder='Aadhar Number' minLength={aadharLength} maxLength={aadharLength} className='no-scroll' required/>
                
                <div className="contact-container">
                    {/* <input type="text" id="phone-number" minLength={phoneNumLen} maxLength={phoneNumLen} placeholder='Phone Number' ref={phoneRef} required/> */}
                    <input type="email" id="email-ID" ref={emailRef} maxLength={emailLenght} placeholder='Email Address' required/>
                    
                    <div id="income">
                        Income &nbsp;
                        <select id="select-income" ref={incomeRef}> 
                            <option value="under 30k">under 30k</option>
                            <option value="under 20k">under 20k</option>
                            <option value="under 10k">under 10k</option>
                            
                        </select>
                    </div>
                </div>
                <div id="lang-pref">
                    Language Preference
                    <div id="languages">
                        <select ref={lang1Ref} id="lang1" className='lang-opt'>
                            <option value="English">English</option>
                            <option value="Kannada">Kannada</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Tamil">Tamil</option>
                            <option value="Telugu">Telugu</option>
                            <option value="Malayalam">Malayalam</option>
                        </select>

                        <select ref={lang2Ref} id="lang2" className='lang-opt'>
                            <option value="None">None</option>
                            <option value="English">English</option>
                            <option value="Kannada">Kannada</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Tamil">Tamil</option>
                            <option value="Telugu">Telugu</option>
                            <option value="Malayalam">Malayalam</option>
                        </select>

                        <select ref={lang3Ref} id="lang3" className='lang-opt'>
                            <option value="None">None</option>
                            <option value="English">English</option>
                            <option value="Kannada">Kannada</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Tamil">Tamil</option>
                            <option value="Telugu">Telugu</option>
                            <option value="Malayalam">Malayalam</option>
                        </select>
                    </div>
                </div>

                <div id='clinicians' className="p-[20px]" ref={checkContainerRef}>
                    <div id='checkBox-container'>
                        <input type="checkbox" checked={takeAudio} onChange={handleAudio} id="AudioLogist" />
                        <label className='clinicians'>AudioLogist (Hearing)</label>
                    </div>

                    <div id='checkBox-container'>
                        <input type="checkbox" checked={takeSLP} onChange={handleSLP} id="slp" />
                        <label className='clinicians'>Speech-Language Pathologist (Speaking)</label>
                    </div>
                </div>
            
                
                <button type="submit" id='patient-subBtn' onClick={validate} >Submit</button>
            </div>
        </main>
    )
}

export default PatientDetails;