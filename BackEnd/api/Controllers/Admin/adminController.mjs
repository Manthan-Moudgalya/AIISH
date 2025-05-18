import adminSchema, { appointmentRequestSchema } from '../../Schema/adminSchema.mjs';
import { generateToken, verifyToken } from '../../Utils/jwtUtils.mjs';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../../Database/db.mjs';
import doctorSchema from '../../Schema/doctorSchema.mjs'


// Admin login controller
export const loginAdmin = async (req, res) => {
  await connectDB();
  try {
    const { email, password } = req.body;
    
    const admin = await adminSchema.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });


    if (!admin) {
      console.log("Admin email not found");
      return res.status(401).json({ error: 'Admin email not found' });
    }
    
    // Verify password
    const isMatch = password === admin.password;
    // console.log("Password: " + password + ", is match: " + isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token with admin role
    const token = generateToken({ id: admin._id, role: 'admin' });
    
    console.log(`${email} successfully logged in to Admin Portal`);
    
    // Send response with token and admin info
    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Middleware to verify admin authentication
export const verifyAdmin = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Not authorized as admin.' });
    }

    // Find admin by ID
    const admin = await adminSchema.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Attach admin to request object
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const patientAppointments = async (req, res) => {
  try {
    await connectDB();
    const { patientName, date, time, disorderType } = req.body;

    console.log(date);
    

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    if (!patientName || !date || !time || !disorderType) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    const admin = await adminSchema.findOne({
      email: { $regex: new RegExp(`^${process.env.ADMIN_EMAIL}$`, 'i') }
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // ✅ Create appointment subdocument as plain object
    const newAppointment = {
      patientName,
      date: parsedDate,
      time,
      disorderType,
      status: 'pending',
      createdAt: new Date()
    };

    admin.appointments.push(newAppointment); // ✅ Correct way to embed
    await admin.save(); // ✅ Saves the embedded appointment

    return res.status(201).json({
      success: true,
      message: 'Appointment request created successfully',
      appointment: admin.appointments[admin.appointments.length - 1]
    });


  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ success: false, message: 'Server error while creating appointment' });
  }
};

export const getAppointments = async (req, res) => {
  try{

    await connectDB();
    
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ error: 'Access denied. Not authorized as admin.' });
    }
    
    // get all the admin details 
    const admin =  await adminSchema.findOne({
      email: { $regex: new RegExp(`^${process.env.ADMIN_EMAIL}$`, 'i') }
    });

    // get all the doctors from the doctor collection    
    const doctors = await doctorSchema.find({});
    
    return res.status(200).send({
      appointments: admin.appointments,
      doctors
    });

  } catch(error){
    console.error('Error creating appointment:', error);
    res.status(500).json({ success: false, message: 'Server error while creating appointment' });
  }
}


export const assignDoctor = async (req,res) => {
  try{
    await connectDB();
    const {
      patientName,
      appointmentDate,
      appointmentTime,
      disorderType,
      doctorName,
    } = req.body;


    console.log(`Request:
      Patient Name     : ${patientName}
      Appointment Date : ${appointmentDate}
      Appointment Time : ${appointmentTime}
      Disorder Type    : ${disorderType}
      Doctor Name      : ${doctorName}`);

    if (!patientName || !appointmentDate || !appointmentTime || !doctorName) {
      
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newRequest = {
      patientName,
      time: appointmentTime,
      date: appointmentDate,
      disorderType: disorderType,
      status: 'confirmed',
    }

    const doctor = await doctorSchema.findOne({
      name: doctorName
    });

    // console.log("Doc Appointments: " + doctor.appointments);
    
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    doctor.appointments.push(newRequest);

    await doctor.save();

    const admin = await adminSchema.findOne({
      email: { $regex: new RegExp(`^${process.env.ADMIN_EMAIL}$`, 'i') }
    });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // remove the appointment from admin’s list
    admin.appointments = admin.appointments.filter(
      a =>
        !(
          a.patientName === patientName
        )
    );

    // save the admin changes
    await admin.save();
    console.log("Successfully deleted records from admin");

    doctor.appointments.map(item => {
        console.log(JSON.stringify(item))
    })

    // confirm
    console.log(`Successfully assigned ${patientName} to Doctor ${doctorName}`);
    // console.log("Remaining admin appointments:", admin.appointments);

    return res
      .status(200)
      .json({ msg: `Successfully assigned ${patientName} to Doctor ${doctorName}` });



  } catch(error){
    console.error('CREATE_APPT_ERROR:', error);
    return res.status(500).json({ success: false, message: 'Server error while creating appointment' });
  }
}

export const rejectAppointment = async (req, res) => {
    try{
        await connectDB();
        const { patientName } = req.body;
        console.log("Patient name: " + patientName);
        
    
        if(!patientName){
            return res.status(400).send({msg: "undefined patient name"})
        }

        const admin = await adminSchema.findOne({
        email: { $regex: new RegExp(`^${process.env.ADMIN_EMAIL}$`, 'i') }
        });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        admin.appointments = admin.appointments.filter(
        a =>
            !(
                a.patientName === patientName
            )
        );

        // save the admin changes
        await admin.save();
        console.log("Successfully rejected the appoinments!!");

        return res.status(200).json({ msg: `Successfully rejected the Appoinment` });

    } catch(error){

        console.error('CREATE_APPT_ERROR:', error);
        return res.status(500).json({ success: false, message: 'Server error while creating appointment' });
    }
}
