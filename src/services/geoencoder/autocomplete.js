import axios from "axios";
import config from "@/assets/config.json";
import {Response} from "@/services/common/response.js";
import {err} from "@/services/common/errors.js";
import {encodeQueryData} from "@/services/common/encoding.js";


const endpoint = "/";

export class Geoencorder {
    // TODO: add pagination
    async getGeoForward(location, limit = 0) {
        let data = {
            key: config.geocoding_api_key,
            location: location,
            outFormat: 'json',
            maxResults: limit
        };

        let resp = await axios.get(`${config.geocoding_api}?${encodeQueryData(data)}`).catch(err);
        return new Response(resp.data, resp.info.statuscode);
    };
}