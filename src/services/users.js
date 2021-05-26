import axios from "axios";
import config from "@/assets/config.json";
import {Response} from "@/services/common/response";

const baseEndpoint = "users";
const fetchUserEndpoint = "/login";

export class UsersQuerier {
    // todo type conversion
    sanitize(data) {
        return data;
    }

    // todo use f-strings
    getUser(credentials) {
        return new Promise((resolve, reject) => {
            axios.post(config.api + baseEndpoint + fetchUserEndpoint, credentials).then((resp) => {
                resolve(new Response(resp.data, resp.status, resp.statusText));
            }).catch((e) => {
                if (e.response.status === 404) {
                    reject(new Response(e.response.data, e.response.status, "User not found"));
                } else if (e.response.status === 400) {
                    reject(new Response(e.response.data, e.response.status, "Incorrect login or password"));
                }
                reject(new Response(e.response.data, e.response.status, e.response.statusText));
            });
        });
    }

    createUser(data) {
        data = this.sanitize(data);
        return new Promise((resolve, reject) => {
            axios.post(config.api + baseEndpoint, data).then((resp) => {
                resolve(new Response(resp.data, resp.status, resp.statusText));
            }).catch((e) => {
                reject(new Response(e.response.data, e.response.status, e.response.statusText));
            });
        });
    }

    updateUser(data) {
        data = this.sanitize(data);
        return new Promise((resolve, reject) => {
            axios.put(config.api + baseEndpoint, data).then((resp) => {
                resolve(new Response(resp.data, resp.status, resp.statusText));
            }).catch((e) => {
                reject(new Response(e.response.data, e.response.status, e.response.statusText));
            });
        });
    }
}