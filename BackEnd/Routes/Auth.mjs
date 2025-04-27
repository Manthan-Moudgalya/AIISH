import { json, Router } from 'express';

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
    console.log(req.body);
    
    return res.status(201).json({ msg: `Phone number: ${req.body.PhoneNumber} successfully registered!!` })

})

export default router;