import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import axios from 'axios';
import dotenv from 'dotenv';

const app = express();
dotenv.config({ path: './.env' });

//keys and configs
const PORT = process.env.PORT || 3000;
const baseURL = 'https://httpbin.org';

//#region Server setup

// default message
app.get('/api', async(req: Request, res: Response) => {
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
  console.log(`${'\x1b[31m'}${err.message}${'/x1b[0m]'}`);
  return res
    .status(500)
    .send({ success: false, statusCode: 500, message: err.message });
});
//#endregion
