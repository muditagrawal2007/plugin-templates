import { DateAndTimeUtils } from "@templates/utils/dateAndTime";
import { encode } from "html-entities";
import { CustomVariable } from "./base";

export class DateCustomVariable extends CustomVariable {
    static definitionName = "date";

    public processInput(input: string, dateAndTimeUtils: DateAndTimeUtils): string {
        // The date input is empty when the user didn't pick a date at all.
        if (!input.trim()) {
            return "";
        }

        return dateAndTimeUtils.formatDateInput(input, dateAndTimeUtils.getDateFormat());
    }

    protected inputHTML(): string {
        return `<input name="${encode(this.name)}" type="date" aria-label="${encode(this.label)}"></input>`;
    }
}
