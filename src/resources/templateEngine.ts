import { Eta } from "eta";
import { join } from "path";

let viewPath = join(__dirname, "../..", "views");
export const eta = new Eta({
  views: viewPath,
  cache: process.env.NODE_ENV === "production",
});
