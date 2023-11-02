import { FastifyRedis } from "@fastify/redis";
import { configDotenv } from "dotenv";
import { FastifyBaseLogger } from "fastify";

configDotenv();

const CACHE_KEY_EXPIRATION = parseInt(
  process.env.CACHE_KEY_EXPIRATION ?? `${5 * 60}`
);

export const requestUrlGenerator = (
  apiEndpoint: string,
  resourceName: string,
  query: Record<string, string>,
) =>
  apiEndpoint.concat(`/${resourceName}?`).concat(
    new URLSearchParams(query).toString()
  );

export const cacheableFunctionGenerator =
  (cacheClient: FastifyRedis, logger?: FastifyBaseLogger) =>
  async (
    cacheKey: string,
    reproducerFn: () => Promise<string>,
    cacheConditionFn: (input: string) => boolean = () => true
  ) => {
    const cacheRes = await cacheClient.get(cacheKey, async (err, _) => {
      if (err) {
        logger?.error({ error: err });
      }
    });
    if (cacheRes) {
      logger?.info({ cacheKey }, "cache hit!");
      return cacheRes;
    }
    logger?.info({ cacheKey }, "cache missed!");
    const reproducedRes = await reproducerFn();
    if (cacheConditionFn(reproducedRes)) {
      cacheClient
        .setex(cacheKey, CACHE_KEY_EXPIRATION, reproducedRes)
        .then(
          () => logger?.debug({ cacheValue: reproducedRes.substring(0,100) }, "response cached")
        );
    }
    return reproducedRes;
  };
