export class Response {
    constructor(data, status, msg="") {
        this.data = data
        this.status = status
        this.msg = msg
    }

    StatusOK() {
        return this.status >= 200 && this.status < 300;
    }

    StatusCritical() {
        return this.status >= 500;
    }
}