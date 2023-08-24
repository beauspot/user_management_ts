import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import xss from "xss-clean";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import session from "express-session";
import rateLimit from "express-rate-limit";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

dotenv.config();

const swaggerDoc = YAML.load(path.join(__dirname, "./swagger.yaml"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});

import connectDb from "./api/config/dbconfig";
import __404_err_page from "./api/middlewares/notFound";
import errorHandlerMiddleware from "./api/middlewares/errHandler";

import userAuthenticationRouter from "./api/routes/userRoutes";
import dashboardRoute from "./api/routes/dashboardRoutes";

const app: Application = express();
const Port = process.env.PORT || 3000;

app.set("trust proxy", true);
app.enable("trust proxy");
app.disable("x-powered-by");
app.use(limiter);
app.use(xss());
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY!,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send(
    '<h1>User Management API Documentation</h1><a href="/api-docs">Documentation</a>'
  );
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use("/api/auth/", userAuthenticationRouter);
app.use("/api", dashboardRoute);

app.use("*", __404_err_page);
app.use(errorHandlerMiddleware);

(async () => {
  try {
    await connectDb(process.env.MONGO_URL!);
    app.listen(Port, () =>
      console.info(`Server listening on http:\//localhost:${Port}`)
    );
  } catch (err: Error | any) {
    console.error(err.message);
    process.exit(1);
  }
})();
