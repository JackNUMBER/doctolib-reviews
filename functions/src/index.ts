import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";

// We are using defineString instead of defineSecret because
// of an issue with the google cloud IAM authorizations.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {defineString} = require("firebase-functions/params");


const findPlaceFromTextUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";

const GoogleMapsAPIKey = defineString("GOOGLE_API_KEY");

export const getDoctorRating = onRequest(async (request, response) => {
  const {name, address} = request.query;

  if (!name || !address) {
    response.status(400).send("Missing name or address");
    return;
  }

  const url = new URL(findPlaceFromTextUrl);

  const params = new URLSearchParams({
    input: `${name} ${address}`,
    inputtype: "textquery",
    fields: "place_id,name,rating,formatted_address",
    key: GoogleMapsAPIKey.value(),
  });

  url.search = params.toString();

  try {
    const apiResponse = await axios.get(url.toString());
    const data = apiResponse.data;
    response.set("Access-Control-Allow-Origin", "*");
    response.send(data);
  } catch (error) {
    logger.error("Error:", error);
    response.status(500).send("Internal server error");
  }
});
