export class OccasionData {
    constructor(data) {
        this.data = data;
    }

    Image() {
        return this.data.image;
    }

    Title() {
        return this.data.title;
    }

    Desc() {
        return this.data.description;
    }

    Date() {
        return `Last updated: ${new Date(this.data.updatedAt).toLocaleString()}`;
    }

    Icon() {
        return this.data.iconUrl;
    }

    Related() {
        return true;
    }
}