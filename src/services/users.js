import axios from "axios";
import config from "@/assets/config.json";
import {err} from "@/services/common/errors";
import {Response} from "@/services/common/response";

const baseEndpoint = "users";
const fetchUserEndpoint = "/login"

export class UsersQuerier {
    // todo type conversion
    sanitize(data) {
        return data;
    }

    // todo use f-strings
    async getUser(credentials) {
        let resp = await axios.post(config.api + baseEndpoint + fetchUserEndpoint, credentials).catch((e) => {

        });
        return new Response(resp.data, resp.status, resp.statusText);
    }

    async createUser(data) {
        data = this.sanitize(data);
        let resp = await axios.post(config.api + baseEndpoint, data).catch(err);
        return new Response(resp.data, resp.status, resp.statusText);
    }
}