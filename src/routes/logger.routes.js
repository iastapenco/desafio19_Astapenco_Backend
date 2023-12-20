import { Router } from "express";
import { addLogger } from "../config/logger.js";

const loggerRouter = Router();
loggerRouter.use(addLogger);

loggerRouter.get("/info", (req, res) => {
  req.logger.info(
    '<span style="color:blue">Texto informativo de Info</span><br/>'
  );
  res.send("Hola!");
});

loggerRouter.get("/warning", (req, res) => {
  req.logger.warning('<span style="color:cyan">Texto Warning</span><br/>');
  res.send("Hola!");
});

loggerRouter.get("/error", (req, res) => {
  req.logger.error('<span style="color:yellow">Texto Error</span><br/>');
  res.send("Hola!");
});

loggerRouter.get("/fatal", (req, res) => {
  req.logger.fatal(
    '<span style="color:red">Texto informativo de Info</span><br/>'
  );
  res.send("Hola!");
});

export default loggerRouter;
