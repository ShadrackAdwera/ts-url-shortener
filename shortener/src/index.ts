import mongoose from 'mongoose';
import { app } from './app';

if (!process.env.MONGO_URI) {
  throw new Error('MONGO URI is not defined!');
}

const startUp = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    app.listen(5000);
    console.log('Listening on PORT: 5000');
  } catch (error) {
    console.log(error);
  }
};

startUp();
