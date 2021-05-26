import axios from "axios";
import config from "@/assets/config.json";
import {Response} from "@/services/common/response";
import {encodeQueryData} from "@/services/common/encoding";

export class ReverseGeocoding {
    getAddress(latlng) {
        let data = {
            latlng: latlng,
            key: config.google_api_key
        };
        return new Promise((resolve, reject) => {
            axios.get(config.geocoding_api + '?' + encodeQueryData(data)).then((resp) => {
                resolve(new Response(resp.data.results.slice(0, 5), resp.data.status));
            }).catch((e) => {
                reject(new Response(e.response.data, e.response.status, e.response.statusText));
            });
        });
    };
}