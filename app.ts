import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

const app = express();
app.use(cors());
app.use(express.json());// Middleware to parse JSON or URL-encoded data
app.use(express.urlencoded({ extended: true })); // For complex form data
dotenv.config({ path: './.env' });

//#region keys and configs
const PORT = process.env.PORT || 3000;
const RECAPTCHA_PRIVATE_KEY = process.env.RECAPTCHA_PRIVATE_KEY || 'xxx';
const baseURL = 'https://httpbin.org';
//#endregion

// Endpoint to handle form submissions
app.post('/submit', async (req, res) => {
  console.log(req.body);
  const token = req.body['g-recaptcha-response'];

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: 'No reCAPTCHA token provided' });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: RECAPTCHA_PRIVATE_KEY,
          response: token,
        },
      }
    );

    const data = response.data;

    if (data.success) {
      return res.json({
        success: true,
        message: 'reCAPTCHA verified successfully',
        email: req.body.email,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification failed',
        errors: data['error-codes'],
        email: req.body.email,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

//#region Server setup

// default message
app.get('/api', async (req: Request, res: Response) => {
  const result = await axios.get(baseURL);
  console.log(result.status);
  res.send({ message: 'Demo API called (httpbin.org)', data: result.status });
});

//default message
app.get('/', (req: Request, res: Response) =>
  res.send({ message: 'API is Live!' })
);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(`${'\x1b[31m'}${err.message}${'\x1b[0m]'}`);
  return res
    .status(500)
    .send({ success: false, statusCode: 500, message: err.message });
});
//#endregion
