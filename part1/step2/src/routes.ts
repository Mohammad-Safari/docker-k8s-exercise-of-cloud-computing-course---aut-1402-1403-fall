import { FastifyInstance } from "fastify";

import { CurrentRequest, TemperatureUnit, requestSchema } from "./models";
import { cacheableFunctionGenerator, requestUrlGenerator } from "./utils";
import { configDotenv } from "dotenv";

configDotenv();
const WEATHER_API_ENDPOINT = process.env.WEATHER_API_ENDPOINT!;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY!;

export async function setupRoutes(fastify: FastifyInstance) {
  fastify.get("/api/ping", function (_, reply) {
    reply.send({ state: "online" });
  });

  fastify.get(
    "/api/current/temperature",
    requestSchema,
    async (request: CurrentRequest, reply) => {
      const q = request.query.name.toLocaleLowerCase();
      const query = { q, key: WEATHER_API_KEY };
      const cacheableFunction = cacheableFunctionGenerator(
        fastify.redis,
        fastify.log
      );
      const reproducerFn = async () => {
        const url = requestUrlGenerator(
          WEATHER_API_ENDPOINT,
          "current.json",
          query
        );
        fastify.log.debug(url);
        const apiRes = await fetch(url);
        return JSON.stringify(await apiRes.json());
      };
      let res = await cacheableFunction(q, reproducerFn, (str) => !!str);
      reply.send(
        JSON.parse(res)["current"][
          request.query.unit == TemperatureUnit.Farenheit ? "temp_f" : "temp_c"
        ]
      );
    }
  );
}
