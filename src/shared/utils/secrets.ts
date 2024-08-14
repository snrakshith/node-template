import crypto from "crypto";

// 34 bytes for 256 bites SHA

const key1 = crypto.randomBytes(34).toString("hex");
const key2 = crypto.randomBytes(34).toString("hex");

console.table([key1, key2]);
