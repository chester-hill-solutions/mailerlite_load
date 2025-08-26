import "dotenv/config";
import HttpError from "./scripts/httpError.js";
import post from "./handlers/post.js";
import get from "./handlers/get.js";

const requestOptions = {
  headers: {
    Authorization: "Bearer " + process.env.BEARER,
  },
};

export const handler = async (event) => {
  let statusCode = 200;
  try {
    let returnBody = "";
    if (!event.httpMethod || !event.body) {
      throw new HttpError(400, "Missing event httpMethod or event body");
    }
    eventBody = JSON.parse(event.body);
    if (event.httpMethod === "POST") {
      let result = await post(eventBody, requestOptions);
      statusCode = result.statusCode;
      body = JSON.stringify(result);
    } else if (event.httpMethod === "GET") {
      if (event.httpMethod) {
        if (eventBody.email) {
          let result = await get(eventBody.email, requestOptions);
          statusCode = result.statusCode;
          body = JSON.stringify(result);
        }
      }
    } else {
      statusCode = 405;
      returnBody = "Method Not Allowed";
    }
  } catch (error) {
    statusCode = error.statusCode ? error.statusCode : 500;
    body = JSON.stringify({
      message: error.message,
      error: error,
    });
  }
  return {
    statusCode,
    returnBody,
  };
};
