import joplin from "api";

import * as assert from "assert";
import * as dedent from "dedent";

import { DateAndTimeUtils } from "@templates/utils/dateAndTime";
import { Logger } from "@templates/logger";
import { Parser } from "@templates/parser";

import { CustomVariable } from "@templates/variables/types/base";
import { DateCustomVariable } from "@templates/variables/types/date";

import * as templateVariableViews from "@templates/views/templateVariables";

// This suite runs in a timezone behind UTC, see jest.timezone.config.js.
describe("Date custom variable in a timezone behind UTC", () => {
    const dateFormat = "DD/MM/YYYY";
    const timeFormat = "HH:mm";
    const userLocale = "en_GB";

    const dateAndTimeUtils = new DateAndTimeUtils(userLocale, dateFormat, timeFormat);
    const logger = new Logger(__dirname);

    const testVariableTypes = (variableTypes: { [name: string]: typeof CustomVariable }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(templateVariableViews, "setTemplateVariablesView").mockImplementation(async (handle: string, title: string, variableDict: { [name: string]: CustomVariable }) => {
            for (const [name, variable] of Object.entries(variableDict)) {
                expect(variable instanceof variableTypes[name]).toBeTruthy();
            }
        });
    };

    const handleVariableDialog = (id: "cancel" | "ok", variables: { [name: string]: string }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(joplin.views.dialogs, "open").mockImplementation(async (handle: string) => {
            if (id === "cancel") {
                return { id };
            }

            return {
                id,
                formData: {
                    variables
                }
            };
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should run in a timezone behind UTC", () => {
        // Guards the premise of this suite. An ISO date is read as UTC
        // midnight, so in a timezone behind UTC it is already yesterday.
        expect(new Date("2026-06-24").getDate()).toEqual(23);
    });

    test("should keep the day that was picked in the date picker (#169)", () => {
        const variable = new DateCustomVariable("some_date", "Some date");

        expect(variable.processInput("2026-06-24", dateAndTimeUtils)).toEqual("24/06/2026");
    });

    test("should keep the day that was picked in the date picker at a month boundary (#169)", () => {
        const variable = new DateCustomVariable("some_date", "Some date");

        // The old behaviour turned this into 31/05/2026.
        expect(variable.processInput("2026-06-01", dateAndTimeUtils)).toEqual("01/06/2026");
    });

    test("should keep the day that was picked in the date picker at a year boundary (#169)", () => {
        const variable = new DateCustomVariable("some_date", "Some date");

        // The old behaviour turned this into 31/12/2025.
        expect(variable.processInput("2026-01-01", dateAndTimeUtils)).toEqual("01/01/2026");
    });

    test("should not shift the date in a note created from a template (#169)", async () => {
        const parser = new Parser(dateAndTimeUtils, "variable-dialog", logger);

        const template = {
            id: "note-id",
            title: "Some Template",
            body: dedent`
                ---
                some_date: date
                ---

                some_date: {{ some_date }}
            `
        };

        testVariableTypes({
            some_date: DateCustomVariable
        });

        handleVariableDialog("ok", {
            some_date: "2026-06-24"
        });

        const parsedTemplate = await parser.parseTemplate(template);

        assert(parsedTemplate);
        expect(parsedTemplate.body).toEqual(dedent`
            some_date: 24/06/2026
        `);
    });
});
