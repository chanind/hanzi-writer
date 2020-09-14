const lolex = require("lolex");
require("jest-fetch-mock").enableMocks();

global.clock = lolex.install({ shouldAdvanceTime: true, advanceTimeDelta: 5 });
