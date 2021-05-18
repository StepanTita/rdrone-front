const [SUCCESS, SUCCESS_TEXT] = ["success", "Event successful"];
const [DANGER, DANGER_TEXT] = ["danger", "Something Bad Happened"];

export class AlertService {
    constructor() {}
    ShowAlert(resp) {
        if (resp.StatusOK()) {
            return [SUCCESS, SUCCESS_TEXT];
        } else if (resp.StatusCritical()) {
            return [DANGER, `${DANGER_TEXT}, Error: ${DANGER_TEXT}`];
        }
    }
}