export class IncidentData {
    constructor(data) {
        this.data = data;
    }

    Image() {
        return this.data.imageUrl;
    }

    Title() {
        return this.data.shortDesc;
    }

    Desc() {
        return this.data.fullDesc;
    }

    Date() {
        return `Since ${new Date(this.data.startTime).toLocaleString()}, to ${new Date(this.data.endTime).toLocaleString()}`;
    }

    Icon() {
        return this.data.iconURL;
    }

    Related() {
        return false;
    }
}