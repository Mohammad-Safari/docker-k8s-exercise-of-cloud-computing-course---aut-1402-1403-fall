import { FastifyRequest } from "fastify";

export enum TemperatureUnit {
  Farenheit,
  Celsius,
}
export type CurrentRequest = FastifyRequest<{
  Querystring: { name: string; unit: TemperatureUnit };
}>;

export const requestSchema = {
  schema: {
    description: 'get weather current temperature',
    querystring: {
      properties: {
        unit: { type: "string" },
        name: { type: "string" },
      },
      required: ["name"],
    },
  },
};
