// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'resolvePro... Remove this comment to see the full error message
const resolvePromises = async (num = 10) => {
  for (let i = 0; i < num; i++) {
    await Promise.resolve();
  }
};

module.exports = {
  resolvePromises,
};
