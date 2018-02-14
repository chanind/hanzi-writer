const lolex = require('lolex');
global.clock = lolex.install({ shouldAdvanceTime: true, advanceTimeDelta: 5 });
