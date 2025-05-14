import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Auth from './Routes/Auth.mjs';
import serverless from 'serverless-http';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// app.use(bodyParser)
// Enable CORS
app.use(cors());

// Mount auth routes
app.use('/api', Auth);

// for localhost
// app.use(cors({
//   origin: 'http://localhost:10001',  
// }));

const port = process.env.PORT || 10001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export const handler = serverless(app); 
