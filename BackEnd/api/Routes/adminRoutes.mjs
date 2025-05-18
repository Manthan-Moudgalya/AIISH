import { Router } from 'express';
import { loginAdmin, verifyAdmin, patientAppointments, getAppointments, assignDoctor, rejectAppointment } 
                                  from '../Controllers/Admin/adminController.mjs';

const router = Router();

// Admin authentication route
router.post('/admin/login', loginAdmin);

// Protected admin routes (example)
router.get('/admin/dashboard', verifyAdmin, (req, res) => {
  res.json({ message: 'Admin dashboard data', admin: req.admin });
});

// patient appointments
router.post('/admin/appointments', patientAppointments);

// get patient appoinments 
router.get('/admin/getAppointments', getAppointments);

// Assign appointment 
router.post('/admin/assignDoctor', assignDoctor);

//Reject the appintment
router.delete('/admin/rejectAppointment', rejectAppointment);

export default router;