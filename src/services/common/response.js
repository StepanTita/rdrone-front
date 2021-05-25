export class Response {
    constructor(data, status, msg="") {
        this.data = data
        this.status = status
        this.msg = msg
    }

    StatusOK() {
        return (this.status >= 200 && this.status < 300) || (this.status === 0) || (this.status === 'OK');
    }

    StatusCritical() {
        return this.status >= 500;
    }

    Status() {
        return this.msg
    }
}