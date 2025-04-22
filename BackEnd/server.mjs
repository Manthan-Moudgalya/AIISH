import express from 'express';
import cors from 'cors'; 
import bodyParser from 'body-parser';
import Auth from './Routes/Auth.mjs'

const app = express();
const PORT = 10001;

// 1st body Parser so that it parses the body (body undefined error) 
app.use(bodyParser.json());
// 2nd for Cross-Origin Resource Sharing
app.use(cors());
// use the Login
app.use(Auth);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
