const generateMessages = (text) => {
  return {
    text,
    createdAt: new Date(),
  };
};

module.exports = {
  generateMessages,
};
