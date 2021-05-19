import axios from "axios"
import config from "@/assets/config.json"
import {Response} from "@/services/common/response.js"
import {err} from "@/services/common/errors.js"


const endpoint = "occasions";

export class OccasionsQuerier {
    // TODO: add pagination
    async getOccasions(offset = 0, limit = -1) {
        let resp = await axios.get(config.api + endpoint).catch(err);
        return new Response(resp.data.reverse().slice(0, 10), resp.status, resp.statusText);
    };

    // todo type conversion
    sanitize(data) {
        return data;
    }

    async createOccasion(data) {
        data = this.sanitize(data);
        let resp = await axios.post(config.api + endpoint, data).catch(err);
        return new Response(resp.data, resp.status, resp.statusText);
    }
}