export class WaypointIterator {
    constructor(options) {
        this.curr = -1;
        this.options = options;
    }

    next() {
        return this.options[this.inc()];
    }

    inc() {
        if (this.options.length < 1) {
            throw new Error("options should never be less than 1 element");
        }
        return this.curr = (this.curr + 1) % this.options.length;
    }
}