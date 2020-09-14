export const resolvePromises = async (num = 10) => {
  for (let i = 0; i < num; i++) {
    await Promise.resolve();
  }
};
