import {G200_MESSAGE, G300_MESSAGE, G400_MESSAGE, G500_MESSAGE, L200_MESSAGE} from "@/services/alerts/messages";

export class Response {
    constructor(data, status, msg = "") {
        this.data = data;
        this.status = status;
        this.msg = msg;
    }

    StatusOK() {
        return (this.status >= 200 && this.status < 300) || (this.status === 0) || (this.status === 'OK');
    }

    StatusCritical() {
        return this.status >= 500;
    }

    Status() {
        if (this.msg !== '') {
            return this.msg;
        }
        if (this.status < 200) {
            return L200_MESSAGE;
        } else if (this.status < 300) {
            return G200_MESSAGE;
        } else if (this.status < 400) {
            return G300_MESSAGE;
        } else if (this.status < 500) {
            return G400_MESSAGE;
        } else if (this.status > 500) {
            return G500_MESSAGE;
        }
        return this.status.replaceAll('_', ' ').toLowerCase();
    }
}