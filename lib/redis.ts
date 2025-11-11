import net from "node:net";
import tls from "node:tls";

const redisUrl = process.env.REDIS_URL;
export const isRedisConfigured = Boolean(redisUrl);

type RedisValue = string | number | null | RedisValue[];

class RedisConnection {
  private readonly url: URL;

  constructor(url: string) {
    this.url = new URL(url);
  }

  async sendCommand(args: string[]): Promise<RedisValue> {
    const isTls = this.url.protocol === "rediss:";
    const port = Number(this.url.port || (isTls ? 6380 : 6379));
    const host = this.url.hostname;
    const dbPath = this.url.pathname.replace(/^\//, "");
    const db = dbPath ? parseInt(dbPath, 10) : undefined;

    const socket = isTls
      ? tls.connect({ host, port, rejectUnauthorized: false })
      : net.createConnection({ host, port });

    await new Promise<void>((resolve, reject) => {
      const onError = (error: Error) => {
        socket.removeListener(isTls ? "secureConnect" : "connect", onConnect);
        reject(error);
      };
      const onConnect = () => {
        socket.removeListener("error", onError);
        resolve();
      };
      socket.once(isTls ? "secureConnect" : "connect", onConnect);
      socket.once("error", onError);
    });

    try {
      if (this.url.password) {
        await this.dispatch(socket, ["AUTH", this.url.password]);
      }
      if (!Number.isNaN(db) && db !== undefined) {
        await this.dispatch(socket, ["SELECT", String(db)]);
      }

      const result = await this.dispatch(socket, args);
      socket.end();
      return result;
    } catch (error) {
      socket.destroy();
      throw error;
    }
  }

  private async dispatch(socket: net.Socket | tls.TLSSocket, args: string[]): Promise<RedisValue> {
    const payload = this.serialize(args);

    return new Promise<RedisValue>((resolve, reject) => {
      let buffer = Buffer.alloc(0);

      const cleanup = () => {
        socket.removeListener("data", onData);
        socket.removeListener("error", onError);
      };

      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const onData = (chunk: Buffer) => {
        buffer = Buffer.concat([buffer, chunk]);
        try {
          const { value, offset } = this.parse(buffer, 0);
          if (offset <= buffer.length) {
            cleanup();
            resolve(value);
          }
        } catch (error) {
          if (error instanceof RangeError) {
            // Wait for more data
            return;
          }
          cleanup();
          reject(error as Error);
        }
      };

      socket.on("data", onData);
      socket.once("error", onError);

      socket.write(payload, (error) => {
        if (error) {
          cleanup();
          reject(error);
        }
      });
    });
  }

  private serialize(args: string[]): Buffer {
    const command = [
      `*${args.length}\r\n`,
      ...args.map((arg) => `$${Buffer.byteLength(arg)}\r\n${arg}\r\n`),
    ].join("");
    return Buffer.from(command, "utf-8");
  }

  private parse(buffer: Buffer, start: number): { value: RedisValue; offset: number } {
    if (start >= buffer.length) {
      throw new RangeError("Unexpected end of RESP data");
    }

    const prefix = String.fromCharCode(buffer[start]);
    let offset = start + 1;

    const readLine = () => {
      const endIndex = buffer.indexOf("\r\n", offset, "utf-8");
      if (endIndex === -1) {
        throw new RangeError("Incomplete RESP message");
      }
      const line = buffer.toString("utf-8", offset, endIndex);
      offset = endIndex + 2;
      return line;
    };

    switch (prefix) {
      case "+": {
        const value = readLine();
        return { value, offset };
      }
      case "-": {
        const message = readLine();
        throw new Error(message);
      }
      case ":": {
        const value = Number(readLine());
        return { value, offset };
      }
      case "$": {
        const length = Number(readLine());
        if (length === -1) {
          return { value: null, offset };
        }
        const end = offset + length;
        if (end + 2 > buffer.length) {
          throw new RangeError("Incomplete bulk string");
        }
        const value = buffer.toString("utf-8", offset, end);
        if (buffer[end] !== 13 || buffer[end + 1] !== 10) {
          throw new RangeError("Missing CRLF after bulk string");
        }
        offset = end + 2;
        return { value, offset };
      }
      case "*": {
        const length = Number(readLine());
        if (length === -1) {
          return { value: null, offset };
        }
        const items: RedisValue[] = [];
        for (let i = 0; i < length; i++) {
          const parsed = this.parse(buffer, offset);
          offset = parsed.offset;
          items.push(parsed.value);
        }
        return { value: items, offset };
      }
      default:
        throw new Error(`Unsupported RESP type: ${prefix}`);
    }
  }
}

let connection: RedisConnection | null = null;

export function getRedisConnection() {
  if (!redisUrl) {
    throw new Error("REDIS_URL environment variable is not set.");
  }
  if (!connection) {
    connection = new RedisConnection(redisUrl);
  }
  return connection;
}

export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisConnection();
  const result = await client.sendCommand(["GET", key]);
  if (typeof result === "string") {
    try {
      return JSON.parse(result) as T;
    } catch (error) {
      console.error("Failed to parse cached value", error);
      return null;
    }
  }
  return null;
}

export async function setCache(key: string, value: unknown, ttlSeconds = 3600) {
  const client = getRedisConnection();
  const payload = JSON.stringify(value);
  await client.sendCommand(["SET", key, payload, "EX", String(ttlSeconds)]);
}

export async function invalidateCache(key: string) {
  const client = getRedisConnection();
  await client.sendCommand(["DEL", key]);
}
