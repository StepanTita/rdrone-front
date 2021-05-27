import axios from "axios";
import config from "@/assets/config.json";
import {Response} from "@/services/common/response.js";
import {getToken} from "@/services/common/storage";


const endpoint = "occasions";

export class OccasionsQuerier {
    // TODO: add pagination
    getOccasions(offset = 0, limit = -1) {
        // move into single generic class
        const token = getToken();
        return new Promise((resolve, reject) => {
            axios.get(config.api + endpoint, {
                headers: {Authorization: "Token " + token}
            }).then((resp) => {
                resolve(new Response(resp.data.reverse().slice(0, 10), resp.status, resp.statusText));
            }).catch((e) => {
                reject(new Response(e.response.data, e.response.status, e.response.statusText));
            });
        });
    };

    getOccasion(id) {
        const token = getToken();
        return new Promise((resolve, reject) => {
            axios.get(config.api + endpoint + '/' + id, {
                headers: {Authorization: "Token " + token}
            }).then((resp) => {
                resolve(new Response(resp.data, resp.status, resp.statusText));
            }).catch((e) => {
                reject(new Response(e.response.data, e.response.status, e.response.statusText));
            });
        });
    }

    // todo type conversion
    sanitize(data) {
        return data;
    }

    createOccasion(data) {
        data = this.sanitize(data);
        const token = getToken();
        return new Promise((resolve, reject) => {
            axios.post(config.api + endpoint + '/', data, {
                headers: {Authorization: "Token " + token}
            }).then((resp) => {
                resolve(new Response(resp.data, resp.status, resp.statusText));
            }).catch((e) => {
                reject(new Response(e.response.data, e.response.status, e.response.statusText));
            });
        });
    }
}