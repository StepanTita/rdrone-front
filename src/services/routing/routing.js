import {Toast} from "vant";
import {EventBus} from "@/services/common/eventBus";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import MapConfig from "@/assets/map-config.json";
import {Response} from "@/services/common/response";

export class Routing {
    constructor(map, directionsService, directionsRenderer) {
        this.map = map;
        this.dS = directionsService;
        this.dR = directionsRenderer;
        this.routeMarkers = [];
    }

    clearRoute() {
        for (let m of this.routeMarkers) {
            m.setMap(null);
        }
    }

    calculateAndDisplayRoute(start, destination) {
        this.clearRoute();
        this.routeMarkers.length = 0;

        this.dS.route({
            origin: start,
            destination: destination,
            travelMode: 'DRIVING',
            avoidTolls: true,
            provideRouteAlternatives: true,
            optimizeWaypoints: true,
            drivingOptions: {
                departureTime: new Date(),
                trafficModel: 'pessimistic'
            },
        }, (response, status) => {
            if (status === 'OK') {
                for (let i = 0; i <  response.routes.length; ++i) {
                    this.dR.setDirections(response);
                    this.dR.setRouteIndex(Number(i));
                }
                // this.showSteps(response);
            } else {
                Toast.fail('something is wrong, please, try again later');
                EventBus.$emit(SHOW_ALERT_EVENT, new Response(null, status));
                console.error(`failed to perform request with status: ${status}`);
            }
        });
    }

    // todo: add checkbox to disable
    showSteps(directionResult) {
        this.routeMarkers = new Array(directionResult.routes.length).fill([]);
        for (let [routeId, route] of directionResult.routes.entries()) {
            const currRoute = route.legs[0];
            for (let i = 0; i < currRoute.steps.length; i++) {
                let marker = new google.maps.Marker({
                    position: currRoute.steps[i].start_point,
                    map: null,
                    optimized: true,
                    icon: MapConfig.routePinImgUrl,
                });
                marker.addListener('click', () => {
                    this.attachInstructionText(marker, currRoute.steps[i].instructions);
                });
                this.routeMarkers[routeId].push(marker);
            }
        }

        this.setMap();
    }

    setMap() {
        for (let m of this.routeMarkers[this.dR.getRouteIndex()]) {
            m.setMap(this.map);
        }
    }

    attachInstructionText(m, text) {
        let stepDisplay = new google.maps.InfoWindow();
        stepDisplay.setContent(text);
        stepDisplay.open(this.map, m);
    }

    computeTotalDistance(result) {
        let total = 0;
        const myroute = result.routes[0];

        if (!myroute) {
            return;
        }

        for (let i = 0; i < myroute.legs.length; i++) {
            total += myroute.legs[i].distance.value;
        }
        total = total / 1000;
        return total + ' km';
    }
}