import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Auth from './Routes/Auth.mjs';
import serverless from 'serverless-http';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount auth routes
app.use(Auth);

// for localhost
// app.use(cors({
//   origin: 'http://localhost:10001',  URL
// }));

// const port = process.env.PORT || 10001;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// export const handler = serverless(app); 


// import express from 'express';
// import cors from 'cors'; 
// import bodyParser from 'body-parser';
// import Auth from './Routes/Auth.mjs'

// const app = express();
// const PORT = 10001;


// // 1st body Parser so that it parses the body (body undefined error) 
// app.use(bodyParser.json());
// // 2nd for Cross-Origin Resource Sharing
// app.use(cors());
// // use the Login
// app.use(Auth);

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// export default app;