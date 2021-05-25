import axios from "axios";
import config from "@/assets/config.json";
import {err} from "@/services/common/errors";
import {Response} from "@/services/common/response";

const endpoint = "users";

export class UsersQuerier {
    // todo type conversion
    sanitize(data) {
        return data;
    }

    async createUser(data) {
        data = this.sanitize(data);
        let resp = await axios.post(config.api + endpoint, data).catch(err);
        return new Response(resp.data, resp.status, resp.statusText);
    }
}