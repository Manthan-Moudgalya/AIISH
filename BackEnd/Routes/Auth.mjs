import { json, Router } from 'express';

const router = Router();

const Usernames = ["Manthan", "Kushal", "Kidsna", "Rahul", "Raghav"];

router.post("/Login", (req, res) => {

    const {Username, Password} = req.body;
    console.log(Username, Password);
    return res.status(201).json({msg: "Hello from back end!!!"});  
})

router.post("/SignUp", (req, res) => {
    const {Username} = req.body;

    // console.log("Username from front-end: "+ Username);
    const userExists = Usernames.includes(Username);
    // console.log("It exists: " + userExists);
    
    if(userExists){
        return res.status(409).json({msg: "Username already exists!!"});
    }

    return res.status(201).json({msg: "User has been created!!!"})
})


router.post('/patientDetails', (req,res) => {
    const {Username} = req.body;
    // console.log(`Patient Details: ${Username}`);
    return res.status(201).json({msg: `Successfully created user: ${Username}!`})
})

export default router;