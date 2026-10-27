// The date picker bug only shows up in timezones west of UTC, because
// `new Date("2026-06-24")` is parsed as UTC midnight and then formatted in
// local time. Jest sandboxes process.env, so the local timezone of a test
// can't be changed from inside the test. The tests that depend on it
// therefore run in a separate suite with the timezone set for the whole
// process.
//
// See jest.timezone.config.js.
module.exports = async () => {
    process.env.TZ = "America/New_York";
};
