import fastifyRedis from "@fastify/redis";
import { configDotenv } from "dotenv";
import { FastifyInstance } from "fastify";

configDotenv();

const REDIS_ADDRESS = process.env.REDIS_ADDRESS ?? "127.0.0.1";
const REDIS_PORT = parseInt(process.env.REDIS_PORT ?? "6379");
const REDIS_PASS = process.env.REDIS_PASS;

export function setupRedis(fastify: FastifyInstance) {
  fastify.register(fastifyRedis, {
    host: REDIS_ADDRESS,
    password: REDIS_PASS,
    port: REDIS_PORT,
  });
}
