const someOrAllNotSet = (arr) => {
  const someUndefined = arr.some((el) => el === '');
  const allDefined = arr.every((el) => el !== '');
  const allUndefined = arr.every((el) => el === '');
  return someUndefined && !allDefined && !allUndefined;
};

module.exports.someOrAllNotSet = someOrAllNotSet;
