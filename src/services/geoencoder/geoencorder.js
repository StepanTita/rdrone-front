import axios from "axios"
import config from "@/assets/config.json"
import {Response} from "@/services/common/response.js"
import {err} from "@/services/common/errors.js"
import {encodeQueryData} from "@/services/common/encoding.js"


const endpoint = "/";

export class Geoencorder {
    // TODO: add pagination
    async getGeo(query, limit = 0) {
        let data = {
            addressdetails: 1,
            q: query.replace(/\s+/g, '+'),
            format: 'json',
            limit: limit
        }

        let resp = await axios.get(`${config.geocoding_api}/${encodeQueryData(data)}`).catch(err);
        return new Response(resp.data, 200);
    };
}