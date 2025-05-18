import { Router } from 'express'; 
import { loginDoctor, signupDoctor, getAppointments } from '../Controllers/Doctor/authController.mjs';

const router = Router();

router.post('/doctor/signup', signupDoctor);
router.post('/doctor/login', loginDoctor);
router.post('/doctor/getAppointments', getAppointments);

export default router;