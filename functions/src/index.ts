import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import axios from "axios";

const findPlaceFromTextUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const GoogleMapsAPIKey = functions.config().google.api_key;

export const getDoctorRating = onRequest(async (request, response) => {
  console.log(request)
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
    key: GoogleMapsAPIKey,
  });

  url.search = params.toString();

  try {
    const apiResponse = await axios.get(url.toString());
    const data = apiResponse.data;
    response.send(data);
  } catch (error) {
    logger.error("Error:", error);
    response.status(500).send("Internal server error");
  }
});
