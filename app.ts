import express from "express";
import bodyParser from "body-parser";
import router from "./routes/index.route";
import { connect } from "./utils/connect";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use("/api", router);

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
  connect();
});
