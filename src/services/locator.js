import {latLng} from "leaflet";
import {err} from "@/services/common/errors";

export class Locator {
    constructor(enableHighAccuracy=true, timeout=5000, maximumAge=0) {
        this.options = {
            enableHighAccuracy: enableHighAccuracy,
            timeout: timeout,
            maximumAge: maximumAge
        };
    }

    async getPosition() {
        let pos = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, this.options)
        );

        const crd = pos.coords;

        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`Precision: ${crd.accuracy} meters.`);

        return latLng(crd.latitude, crd.longitude);
    }
}