import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import env from "./env";

const tagID = "199757c0f3ae9231";
const response = await fetch("https://quantized.co/graphql", {
  headers: {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9,la;q=0.8,ja;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/json",
    pragma: "no-cache",
    "sec-ch-ua":
      '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    cookie: env.COOKIE,
  },
  referrer: `https://quantized.co/review/${tagID}`,
  referrerPolicy: "strict-origin-when-cross-origin",
  method: "POST",
  mode: "cors",
  credentials: "include",
  body: JSON.stringify({
    operationName: "browseableCards",
    variables: { tagID },
    query: `query browseableCards($tagID: ID!) {
  browseableCards(tagID: $tagID) {
    status
    interval
    due
    index
    timesSeen
  }
}`,
  }),
});
const json = await response.json();

const downloadsPath = new URL("../downloads", import.meta.url).pathname;
if (!existsSync(downloadsPath)) mkdirSync(downloadsPath);
const dataPath = join(downloadsPath, "data.json");
writeFileSync(dataPath, JSON.stringify(json));
console.log("Done");
