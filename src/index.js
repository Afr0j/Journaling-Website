import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {

    app.on('error', (err) => {
      console.log("Server error", err)
      throw err;
    })

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server is running at port : ${process.env.PORT || 5000}`,
      );
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
