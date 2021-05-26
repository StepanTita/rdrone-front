import axios from "axios";
import config from "@/assets/config.json";
import {Response} from "@/services/common/response.js";
import {err} from "@/services/common/errors.js";


const endpoint = "comments";

export class CommentsQuerier {
    // TODO: add pagination
    getComments(offset = 0, limit = -1) {
        return new Promise((resolve, reject) => {
            axios.get(config.api + endpoint).then((resp) => {
                resolve(new Response(resp.data.reverse().slice(0, 10), resp.status, resp.statusText));
            }).catch((e) => {
                reject(new Response(e.response.data, e.response.status, e.response.statusText));
            });
        });
    };

    // todo type conversion
    sanitize(data) {
        return data;
    }

    createComment(data) {
        data = this.sanitize(data);
        return new Promise((resolve, reject) => {
            axios.post(config.api + endpoint, data).then((resp) => {
                resolve(new Response(resp.data, resp.status, resp.statusText));
            }).catch((e) => {
                reject(new Response(e.response.data, e.response.status, e.response.statusText));
            });
        });
    }
}