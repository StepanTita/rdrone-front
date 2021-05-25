import {EventBus} from "@/services/common/eventBus";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {Response} from "@/services/common/response";

export function err(e) {
    console.log('haha')
    EventBus.$emit(SHOW_ALERT_EVENT, new Response(null, e, e.message));
    return e
}