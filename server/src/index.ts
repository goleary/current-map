import express, { ErrorRequestHandler } from "express";
import cors from "cors";

import currentApi from "./clients/currents";

const app = express();
const port = process.env.PORT;

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Fatal request error");
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).send();
};

app.use(cors());
app.use(errorHandler);

app.get("/", async (req, res) => {
  console.log("request received");
  const start = new Date();
  const result = await currentApi.getStationDataWithPredictions();
  console.log(`request took ${Date.now() - start.getTime()}ms`);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
