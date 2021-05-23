import {Marker} from "@/services/map/marker";
import {WaypointIterator} from "@/services/common/iterator";

export class Waypointing {
    constructor() {
        this.waypoints = []
        this.waypointIterator = new WaypointIterator("AB");
        this.idCounter = 0;
    }

    setRouting(routing) {
        this.routing = routing;
    }

    nextID() {
        return this.idCounter++;
    }

    add(w) {
        const style = {
            color: "#FFF",
            text: this.waypointIterator.next(),
        };

        if (this.waypoints.length > 1) {
            this.waypoints = this.waypoints.slice(1,);
        }

        this.waypoints.push(new Marker(this.nextID(), w.latLng, null, style));

        if (this.waypoints.length > 1) {
            this.routing.calculateAndDisplayRoute(this.waypoints[0].Position(), this.waypoints[1].Position());
            this.waypoints.length = 0;
        }

        return this.waypoints;
    }
}