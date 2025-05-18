import doctorSchema from '../../Schema/doctorSchema.mjs';
import {generateToken, verifyToken} from '../../Utils/jwtUtils.mjs';
import connectDB from '../../Database/db.mjs';
import sampleAppointments from '../../Schema/sampleAppointments.mjs';


export const signupDoctor = async (req, res) => {
  await connectDB();
    try {
      const { name, email, password, doctorType } = req.body;
      
      console.log("Request from SignUp doctor: " + name + email + password + doctorType );
      
      const existingDoctor = await doctorSchema.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const appointments = []
      const doctor = new doctorSchema({ name, email, password, doctorType, appointments});
      await doctor.save();

      const token = generateToken({ id: doctor._id, doctorType: doctorType });
      console.log("Successfully created doctor account");
      
      res.status(201).json({
        token,
        doctor: {
          id: doctor._id,
          name: doctor.name,
          doctorType: doctor.doctorType,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
};

export const loginDoctor = async (req, res) => {
    await connectDB();
    try {
      const { email, password } = req.body;

      const doctor = await doctorSchema.findOne({ email });
      if (!doctor) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await doctor.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken({ id: doctor._id, role: 'doctor' });

      console.log(`${email} Successfully Logined Doctor Protal`);
      res.json({
        token,
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
};

export const getAppointments = async (req, res) => {
  // console.log("Here: " + sampleAppointments);
    await connectDB();
    const { doctorName } = req.body;
    
    const doctor = await doctorSchema.findOne({name: doctorName});
    if(!doctorName){
        return res.status(400).send({msg: `Doctor ${doctorName} not found!`})
    }

    return res.status(201).send({appointments: doctor.appointments})
}