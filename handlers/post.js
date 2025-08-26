import { https } from "https";
import "dotenv/config";
import { HttpError } from "./scripts/httpError.js";

const defaultOptions = {
  hostname: process.env.HOSTNAME, // replace with your API
  method: "POST",
  path: "/api/subscribers",
  headers: {
    "Content-Type": "application/json",
  },
};

const post = (payload, options = {}) => {
  const reqOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  return new Promise((resolve, reject) => {
    const req = https.request(reqOptions, (res) => {
      let responseBody = "";

      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        let parsed = {};
        try {
          parsed = JSON.parse(responseBody);
        } catch {
          // Not JSON, keep raw string
          parsed = { data: responseBody };
        }

        const result = {
          statusCode: res.statusCode,
          message: parsed.message || null,
          data: parsed.data || null,
          errors: parsed.errors || null,
        };

        resolve(result);
      });
    });

    req.on("error", (err) => {
      // Wrap network/request errors in HttpError
      reject(new HttpError(err.message, 500, { originalError: err }));
    });

    // Send payload
    req.write(JSON.stringify(payload));
    req.end();
  });
};

export default post;
