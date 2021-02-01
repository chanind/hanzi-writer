/**
 * Hack to allow us to modify jsdom from within tests
 * from https://github.com/facebook/jest/issues/5124#issuecomment-352749005
 * */

const JSDOMEnvironment = require('jest-environment-jsdom');

module.exports = class JSDOMEnvironmentGlobal extends JSDOMEnvironment {
  constructor(config) {
    super(config);

    this.global.jsdom = this.dom;
  }

  teardown() {
    this.global.jsdom = null;

    return super.teardown();
  }
};
