import config from "@/assets/config.json";
import axios from "axios";
import {encodeQueryData} from "@/services/common/encoding";
import {err} from "@/services/common/errors";
import {Response} from "@/services/common/response";

export class IncidentsQuerier {
    constructor(boundingBox) {
        this.boundingBox = boundingBox;
    }

    getIncidents() {
        // todo: add config
        let data = {
            boundingBox: this.boundingBox,
            key: config.map_quest_api_key,
            filters: "construction,incidents",
            outFormat: "json"
        };
        return new Promise((resolve, reject) => {
            axios.get(config.map_quest_api + '?' + encodeQueryData(data)).then((resp) => {
                resolve(new Response(resp.data.incidents.slice(0, 10), resp.status, resp.statusText));
            }).catch((e) => {
                reject(new Response(e.response.data, e.response.status, e.response.statusText));
            });
        });
    }
}