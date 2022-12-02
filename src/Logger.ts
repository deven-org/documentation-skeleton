import { Signale, SignaleOptions } from "signale";

const options: SignaleOptions = {
  stream: process.stdout,
};

export const logger = new Signale(options);
