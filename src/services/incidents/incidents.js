import config from "@/assets/config.json";
import axios from "axios";
import {encodeQueryData} from "@/services/common/encoding";
import {err} from "@/services/common/errors";
import {Response} from "@/services/common/response";

export class Incidents {
    constructor(boundingBox) {
        this.boundingBox = boundingBox;
    }

    async getIncidents() {
        let data = {
            boundingBox: this.boundingBox,
            key: config.map_quest_api_key
        }
        let resp = await axios.get(config.map_quest_api_key + '?' + encodeQueryData(data)).catch(err);
        return new Response(resp.data.incidents, resp.info.statuscode, resp.info.messages);
    }
}