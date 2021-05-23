export class Marker {
    constructor(id, position, data, style) {
        this.id = id.toString();
        this.position = position;
        this.data = data;
        this.style = style;
    }

    Position() {
        return this.position
    }

    Id() {
        return this.id
    }

    Data() {
        return this.data
    }

    Style() {
        return this.style
    }
}