const [SUCCESS, SUCCESS_TEXT] = ["success", "Event successful"];
const [CRITICAL, CRITICAL_TEXT] = ["critical", "Something Bad Happened"];

export class AlertService {
    constructor() {}
    ShowAlert(resp) {
        if (resp.StatusOK()) {
            return [SUCCESS, SUCCESS_TEXT];
        } else if (resp.StatusCritical()) {
            return [CRITICAL, `${CRITICAL_TEXT}, Error: ${CRITICAL_TEXT}`];
        }
    }
}