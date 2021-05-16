import axios from "axios"
import config from "@/assets/config.json"
import {Response} from "@/services/common/response.js"
import {err} from "@/services/common/errors.js"


const endpoint = "comments";

export class CommentsQuerier {
    // TODO: add pagination
    async getComments(offset = 0, limit = -1) {
        let resp = await axios.get(config.api + endpoint).catch(err);
        return new Response(resp.data.slice(0, 3), resp.status, resp.statusText);
    };
}