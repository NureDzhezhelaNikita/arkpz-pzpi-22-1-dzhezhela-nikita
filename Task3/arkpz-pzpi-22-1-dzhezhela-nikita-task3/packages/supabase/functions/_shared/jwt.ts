import { create, verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

const exp = 60 * 60 * 24 * 365 * 10;
const key = Deno.env.get("IOT_JWT_SECRET");

if (!key) {
  throw new Error("IOT_JWT_SECRET is not set");
}

const textEncoder = new TextEncoder();
const keyData = textEncoder.encode(key);
const cryptoKey = await crypto.subtle.importKey(
  "raw",
  keyData,
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"]
);

interface BaseJwtPayload {
  exp: number;
  iat: number;
}

export async function signJwt<T extends object>(payload: T): Promise<string> {
  return await create(
    { alg: "HS512", typ: "JWT" },
    {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + exp,
      iat: Math.floor(Date.now() / 1000),
    },
    cryptoKey
  );
}

export async function verifyJwt<T extends object>(
  token: string
): Promise<T & BaseJwtPayload> {
  return (await verify(token, cryptoKey)) as unknown as T & BaseJwtPayload;
}
