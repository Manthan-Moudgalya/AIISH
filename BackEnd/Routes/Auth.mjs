import { Router } from 'express';
import patientModel from '../Schema/patientSchema.mjs';
// import { model } from 'mongoose';
import encryptPassword from '../Encryption/encrypt.mjs';
import connectDB from '../Database/db.mjs';
import isPasswordCorrect from '../Encryption/comparePass.mjs';

await connectDB();

const router = Router();

router.post("/Login", async (req, res) => {

    const { PhoneNumber, Password } = req.body;
    
    const patient = await patientModel.findOne({phoneNumber: PhoneNumber});
    
    if(patient === null){
        return res.status(404).send({msg : "Phone number not registerd!!"});
    }
    
    const match = await isPasswordCorrect(Password, patient.password);

    if(!match){
        return res.status(401).send({msg : "Enter correct password!!"});
    }

    console.log(`Successfully Login Phone number: ${PhoneNumber}`);

    return res.status(201).json({ msg: "Hello from back end!!!" });

})

router.post("/SignUp", async (req, res) => {
    const { userPhoneNumber } = req.body;
    // console.log("Request Phone Number: " + userPhoneNumber);
    const existingPatient = await patientModel.findOne({ phoneNumber: userPhoneNumber });

    if(existingPatient !== null){
        return res.status(409).json({ msg: "Phone number already exists!!" });
    }

    // console.log("Here: "+ existingPatient);
    return res.status(201).json({ msg: "Account has been created!!!" })
    
})


router.post('/patientDetails', async (req, res) => {
    // const { Username } = req.body;
    const { PhoneNumber, Password, cleanedAadharNum,
        email, lang1, lang2, lang3,
        totalIncome,AudioLogist,
        SLPathologist, patientName } = req.body;

    const encryptedPass = await encryptPassword(Password);
    const patient = new patientModel(
        {
            phoneNumber: PhoneNumber,
            aadharNumber: cleanedAadharNum,
            password: encryptedPass, patientName,
            email, lang1, lang2, lang3,
            totalIncome, AudioLogist,
            SLPathologist
        }
    )

    const savePatient = await patient.save();
    console.log("Saved Patient Details: " + savePatient);
    return res.status(201).json({ msg: `Patient registered with ${PhoneNumber}`});
})

router.get('/test', (req, res) => {
    console.log("Test route hit");
    res.status(202).send({msg: "Test successful"});
});


export default router;