const [SUCCESS, SUCCESS_TEXT] = ["success", "Load successful"];
const [DANGER, DANGER_TEXT] = ["danger", "Something Bad Happened"];

export class AlertService {
    constructor() {}
    ShowAlert(resp) {
        if (resp.StatusOK()) {
            return [SUCCESS, SUCCESS_TEXT];
        } else if (resp.StatusCritical()) {
            return [DANGER, `${DANGER_TEXT}, Error: ${DANGER_TEXT}`];
        }
        return [DANGER, `${DANGER_TEXT}, Error: ${DANGER_TEXT}`];
    }
}