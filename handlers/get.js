import https from "https";
import "dotenv/config";
import HttpError from "../scripts/httpError.js";

const defaultOptions = {
  hostname: process.env.HOSTNAME, // replace with your API
  method: "GET",
  path: "/api/subscribers",
  headers: {
    "Content-Type": "application/json",
  },
};

const get = (payload, options = {}) => {
  console.log("mailerlite_load/handlers/get");
  const reqOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  payload ? (reqOptions.path = reqOptions.path + "/" + payload) : null;
  //console.log("options", reqOptions);

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
        //console.log(result);
        resolve(result);
      });
    });

    req.on("error", (err) => {
      console.log("Request send error", err);
      // Wrap network/request errors in HttpError
      reject(new HttpError(err.message, 500, { originalError: err }));
    });

    console.log("Send payload");
    req.write(JSON.stringify(payload));
    req.end();
  });
};

export default get;
