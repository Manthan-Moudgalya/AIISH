import {useRef, useState} from 'react'
import './PatientDetails.css'

function PatientDetails() {

    const aadharLength = 12;
    const phoneNumLen = 10;
    const emailLenght = 30;

    const aadharRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();

    const lang1Ref = useRef();
    const lang2Ref = useRef();
    const lang3Ref = useRef();

    const[takeAudio, setAudio] = useState(false);
    const[takeSLP, setSLP] = useState(false);

    function handleAudio(event){
        setAudio(event.target.checked);
    }

    function handleSLP(e){
        setSLP(e.target.checked);
    }

    async function validate(){
        const aadharNumber = aadharRef.current.value;
        const phoneNumber = phoneRef.current.value;

        aadharRef.current.style.border = "none";
        phoneRef.current.style.border = "none";

        const cleanedAadharNum = aadharNumber.replace(/\D/g, '');
        const cleanedPhoneNum = phoneNumber.replace(/\D/g, '');

        const aadharValid = cleanedAadharNum.length === aadharLength ;
        const phoneNumValid = cleanedPhoneNum.length === phoneNumLen ;

        if(aadharValid && phoneNumValid){
            // alert("Valid");
            const Username = localStorage.getItem('Username')
            const Password = localStorage.getItem('Password')
            const email = emailRef.current.value;
            const lang1 = lang1Ref.current.value;
            const lang2 = lang2Ref.current.value;
            const lang3 = lang3Ref.current.value;
            console.log(`${Username} ${Password} \n${cleanedAadharNum} ${cleanedPhoneNum}\n${email} 
                \n${lang1} ${lang2} ${lang3} \nAudio: ${takeAudio} SLP: ${takeSLP}`);

            try{
                const response = await fetch('http://127.0.0.1:10001/patientDetails',{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        Username, Password, cleanedAadharNum, cleanedPhoneNum, email, lang1, lang2, lang3, AudioLogist: takeAudio, SLPathologist: takeSLP
                    })
                })

                if(response.ok){
                    const data = await response.json();
                    alert(data.msg);
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
        }

        if(!phoneNumValid){
            phoneRef.current.style.border = "2px solid red";
        }
        alert("Not Valid Inputs");
    }
    

    return(
        <main>
            <div id="container">
                <div id='container-heading'>Details</div>
                <input type="text" id="aadhar" ref={aadharRef} placeholder='Aadhar Number' minLength={aadharLength} maxLength={aadharLength} className='no-scroll' required/>
                
                <div className="contact-container">
                    <input type="text" id="phone-number" minLength={phoneNumLen} maxLength={phoneNumLen} placeholder='Phone Number' ref={phoneRef} required/>

                    <input type="email" id="email-ID" ref={emailRef} maxLength={emailLenght} placeholder='Email Address' required/>
                </div>

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

                <div id='clinicians'>
                    <div id='checkBox-container'>
                        <input type="checkbox" checked={takeAudio} onChange={handleAudio} id="AudioLogist" />
                        <label className='clinicians'>AudioLogist</label>
                    </div>

                    <div id='checkBox-container'>
                        <input type="checkbox" checked={takeSLP} onChange={handleSLP} id="slp" />
                        <label className='clinicians'>Speech-Language Pathologist</label>
                    </div>
                </div>
            
                <button type="submit" id='patient-subBtn' onClick={validate} >Submit</button>
            </div>
        </main>
    )
}

export default PatientDetails;