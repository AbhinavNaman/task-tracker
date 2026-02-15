import app from "./app.js";
import { connectDB } from "./config/db.js";
import { redisClient } from "./config/redis.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await redisClient.connect();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
