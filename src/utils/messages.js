const generateMessages = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date(),
  };
};

module.exports = {
  generateMessages,
};
