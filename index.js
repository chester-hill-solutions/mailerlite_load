import "dotenv/config";
import HttpError from "./scripts/httpError.js";
import post from "./handlers/post.js";
import get from "./handlers/get.js";
import { safeJsonParse } from "./scripts/safeJson.js";

const requestOptions = {
  headers: {
    Authorization: "Bearer " + process.env.BEARER,
  },
};

export const handler = async (event) => {
  let statusCode = 200;
  let returnBody = "";
  console.log(
    "mailerlite_load handler",
    event.body.email ? event.body.email : event
  );
  try {
    if (!event.httpMethod || !event.body) {
      console.log("Missing event httpMethod or event body");
      throw new HttpError(400, "Missing event httpMethod or event body");
    }
    let eventBody = safeJsonParse(event.body);
    if (event.httpMethod === "POST") {
      let result = await post(eventBody, requestOptions);
      statusCode = result.statusCode;
      body = JSON.stringify(result);
    } else if (event.httpMethod === "GET") {
      let result = await get(
        eventBody.email ? eventBody.email : undefined,
        requestOptions
      );
      statusCode = result.statusCode;
      returnBody = JSON.stringify(result);
    } else {
      statusCode = 405;
      returnBody = "Method Not Allowed";
    }
  } catch (error) {
    console.error("Unhandled error", error);
    statusCode = error.statusCode ? error.statusCode : 500;
    returnBody = JSON.stringify({
      message: error.message,
      error: error,
    });
  }
  return {
    statusCode,
    returnBody,
  };
};
