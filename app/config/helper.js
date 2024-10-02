const someOrAllNotSet = (arr) => {
  const someUndefined = arr.some((el) => el === '');
  const allDefined = arr.every((el) => el !== '');
  const allUndefined = arr.every((el) => el === '');
  return someUndefined && !allDefined && !allUndefined;
};

const formatErrors = (error) => {
  return JSON.stringify(error.issues);
};

module.exports.someOrAllNotSet = someOrAllNotSet;
module.exports.formatErrors = formatErrors;
