import { Router } from 'express';
import patientModel from '../Schema/patientSchema.mjs';
import encryptPassword from '../Encryption/encrypt.mjs';
import connectDB from '../Database/db.mjs';
import isPasswordCorrect from '../Encryption/comparePass.mjs';
import { generateToken } from '../Utils/jwtUtils.mjs'; // JWT utils
import authenticatePatient from './authenticatePatient.mjs';


const router = Router();

router.post("/Login", async (req, res) => {
    await connectDB();

    const { PhoneNumber, Password } = req.body;

    try {
        const patient = await patientModel.findOne({ phoneNumber: PhoneNumber });

        if (!patient) {
            return res.status(404).send({ msg: "Phone number not registered!" });
        }

        const match = await isPasswordCorrect(Password, patient.password);
        if (!match) {
            return res.status(401).send({ msg: "Incorrect password!" });
        }

        const token = generateToken({
            id: patient._id,
            role: 'patient',
            phone: patient.phoneNumber
        });

        return res.status(200).json({
            msg: "Login successful!",
            token,
            patient: {
                id: patient._id,
                name: patient.patientName,
                phone: patient.phoneNumber
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ msg: "Server error." });
    }
});

router.get('/appointments', authenticatePatient, async (req, res) => {
    // Only logged-in patients can access this
    console.log('User ID:', req.user.id);
    res.json({ msg: 'Appointments visible to patient' });
});


router.post("/SignUp", async (req, res) => {
    const { userPhoneNumber } = req.body;
    await connectDB();
    const existingPatient = await patientModel.findOne({ phoneNumber: userPhoneNumber });

    if(existingPatient !== null){
        return res.status(409).json({ msg: "Phone number already exists!!" });
    }

    return res.status(201).json({ msg: "Account has been created!!!" })
    
})


router.post('/patientDetails', async (req, res) => {
    await connectDB();
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