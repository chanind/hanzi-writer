require("jest-fetch-mock").enableMocks();

window.clock = require("@sinonjs/fake-timers").install({
  shouldAdvanceTime: true,
  advanceTimeDelta: 5,
});
