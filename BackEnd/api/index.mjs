import express from 'express';
import cors from 'cors';
import Auth from './Routes/Auth.mjs';
import serverless from 'serverless-http';
import DoctorRoutes from './Routes/doctorRoutes.mjs';
import adminRoutes from './Routes/adminRoutes.mjs'

const app = express();

// Parse JSON request bodies
app.use(express.json());

// app.use(bodyParser)
// Enable CORS
app.use(cors());

// Mount auth routes
app.use('/api', Auth);

// Mount doctor routes
app.use('/api', DoctorRoutes);

// Mount admin routes
app.use('/api', adminRoutes);

const port = process.env.PORT || 10001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export const handler = serverless(app); 
