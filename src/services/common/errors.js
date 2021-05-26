import {EventBus} from "@/services/common/eventBus";
import {SHOW_ALERT_EVENT} from "@/services/common/events";

export function err(e) {
    EventBus.$emit(SHOW_ALERT_EVENT, e);
    return e
}