import { DateAndTimeUtils } from "@templates/utils/dateAndTime";
import { DateCustomVariable } from "@templates/variables/types/date";

describe("Date custom variable", () => {
    const dateFormat = "DD/MM/YYYY";
    const timeFormat = "HH:mm";
    const userLocale = "en_GB";

    const dateAndTimeUtils = new DateAndTimeUtils(userLocale, dateFormat, timeFormat);

    test("should format the date that was picked in the date picker", () => {
        const variable = new DateCustomVariable("some_date", "Some date");

        expect(variable.processInput("2026-06-24", dateAndTimeUtils)).toEqual("24/06/2026");
    });

    test("should format the date according to the user config", () => {
        const utils = new DateAndTimeUtils(userLocale, "DD.MM.YYYY", timeFormat);
        const variable = new DateCustomVariable("some_date", "Some date");

        expect(variable.processInput("2026-06-24", utils)).toEqual("24.06.2026");
    });

    test("should return an empty string when no date was picked", () => {
        const variable = new DateCustomVariable("some_date", "Some date");

        expect(variable.processInput("", dateAndTimeUtils)).toEqual("");
        expect(variable.processInput("   ", dateAndTimeUtils)).toEqual("");
    });

    test("should throw an error when the date can't be parsed", () => {
        const variable = new DateCustomVariable("some_date", "Some date");

        expect(() => variable.processInput("not a date", dateAndTimeUtils)).toThrow();
    });

    test("should still support dates that aren't in the ISO format", () => {
        const variable = new DateCustomVariable("some_date", "Some date");

        expect(variable.processInput("2026/06/24", dateAndTimeUtils)).toEqual("24/06/2026");
    });
});
