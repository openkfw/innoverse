const formatErrors = (error) => {
  return JSON.stringify(error.issues);
};

module.exports.formatErrors = formatErrors;
