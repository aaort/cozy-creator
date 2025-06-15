import { MODELS } from "@constants/data";

export function getRandomModel() {
  return MODELS[Math.round(Math.random() * 10)];
}
