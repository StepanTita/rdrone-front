import config from "@/assets/config.json";
import axios from "axios";
import {encodeQueryData} from "@/services/common/encoding";
import {err} from "@/services/common/errors";
import {Response} from "@/services/common/response";

export class IncidentsQuerier {
    constructor(boundingBox) {
        this.boundingBox = boundingBox;
    }

    async getIncidents() {
        let data = {
            boundingBox: this.boundingBox,
            key: config.map_quest_api_key,
            filters: "construction,incidents",
            outFormat: "json"
        };
        let resp = await axios.get(config.map_quest_api + '?' + encodeQueryData(data)).catch(err);
        console.log(resp);
        return new Response(resp.data.incidents.slice(0, 10), resp.status, resp.statusText);
    }
}