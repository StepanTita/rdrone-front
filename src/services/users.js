import axios from "axios";
import config from "@/assets/config.json";
import {Response} from "@/services/common/response";
import {getToken, setToken} from "@/services/common/storage";

const baseEndpoint = "auth";
const fetchUserEndpoint = "/api-token-auth";

export class UsersQuerier {
    // todo type conversion
    sanitize(data) {
        return data;
    }

    // todo use f-strings
    getUser(credentials) {
        return new Promise((resolve, reject) => {
            axios.post(config.api + baseEndpoint + fetchUserEndpoint + '/', credentials).then((resp) => {
                setToken(resp.data.token);
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

    createUser(username, data) {
        data = this.sanitize(data);
        return new Promise((resolve, reject) => {
            axios.post(config.api + baseEndpoint + '/' + username, data).then((resp) => {
                resolve(new Response(resp.data, resp.status, resp.statusText));
            }).catch((e) => {
                reject(new Response(e.response.data, e.response.status, e.response.statusText));
            });
        });
    }

    updateUser(username, data) {
        data = this.sanitize(data);
        const token = getToken();
        return new Promise((resolve, reject) => {
            axios.put(config.api + baseEndpoint + '/' + username, data, {
                headers: {Authorization: "Token " + token}
            }).then((resp) => {
                resolve(new Response(resp.data, resp.status, resp.statusText));
            }).catch((e) => {
                reject(new Response(e.response.data, e.response.status, e.response.statusText));
            });
        });
    }
}