import { configDotenv } from "dotenv";
import Fastify from "fastify";
import { setupRedis } from "./redis";
import { setupRoutes } from "./routes";

configDotenv();

const API_PORT = parseInt(process.env.API_PORT ?? "3000");

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    setupRedis(fastify);
    setupRoutes(fastify);
    fastify.listen({ port: API_PORT });
    await fastify.ready();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
