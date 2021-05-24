import axios from "axios";
import config from "@/assets/config.json";
import {err} from "@/services/common/errors";
import {Response} from "@/services/common/response";
import {encodeQueryData} from "@/services/common/encoding";

export class ReverseGeocoding {
    async getAddress(latlng) {
        let data = {
            latlng: latlng,
            key: config.google_api_key
        }
        let resp = await axios.get(config.geocoding_api + '?' + encodeQueryData(data)).catch(err);
        return new Response(resp.data.results.slice(0, 5), resp.data.status);
    };
}