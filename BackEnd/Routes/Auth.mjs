import { Router } from 'express';
// import patientSchema from '../Schema/patientSchema.mjs';
// import { model } from 'mongoose';

const router = Router();

const phoneNumbers = ["1234567891", "0987654321", "5674839201"];

router.post("/Login", (req, res) => {

    const { PhoneNumber, Password } = req.body;
    console.log(PhoneNumber, Password);
    return res.status(201).json({ msg: "Hello from back end!!!" });

})

router.post("/SignUp", (req, res) => {
    const { userPhoneNumber } = req.body;
    console.log("Phone Numer from front-end: " + userPhoneNumber);
    
    const numberExists = phoneNumbers.includes(userPhoneNumber);
    
    if (numberExists) {
        return res.status(409).json({ msg: "Phone number already exists!!" });
    }
    return res.status(201).json({ msg: "Account has been created!!!" })
})


router.post('/patientDetails', (req, res) => {
    // const { Username } = req.body;
    const { PhoneNumber, Password, cleanedAadharNum,
        email, lang1, lang2, lang3,
        totalIncome,AudioLogist,
        SLPathologist} = req.body;

    // prints the request
    console.log(req.body);

    
    return res.status(201).json({ msg: `Patient registered with ${PhoneNumber}`});
})

router.get('/test', (req, res) => {
    console.log("Test route hit");
    res.status(202).send({msg: "Test successful"});
});


export default router;