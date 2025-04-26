import { useRef } from 'react';
import "./ErrorBlock.css"

function ErrorBlock(props) {

    const msgBlockRef = useRef();

    function displayNone(){
        // console.log(message);
        
        msgBlockRef.current.style.display = "none";
    }

    return(
        <div className="error-container" ref={msgBlockRef}>
            <div className="error-head">
                <div className="error-code">Error: {props.code}</div>
            </div>

            <div className='error-msg'>{props.message}
                <button className="error-btn" onClick={() => displayNone() }>Okay</button>
            </div>
        </div>
    )
}

export default ErrorBlock;