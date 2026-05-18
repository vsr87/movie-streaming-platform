import "dotenv/config";
import express from "express";
import { router as movieRouter } from "./routes/movie-routes";
import { router as accountRouter } from "./routes/account-routes";
import authRouter from "./routes";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Movie Streaming API is running" });
});

// Todas as rotas de filmes começam com /movies
app.use("/", movieRouter);
app.use("/accounts", accountRouter);
app.use("/", authRouter);

app.listen(3000, () => console.log("Server is running!"));