module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    domainHeader: {
      type: Sequelize.STRING,
      required: true,
    },
    email: {
      type: Sequelize.STRING,
      required: true,
    },
    username: {
      type: Sequelize.STRING,
      required: true,
    },
    refDomain: {
      type: Sequelize.STRING,
      required: true,
    },
    passwordHash: {
      type: Sequelize.STRING,
      required: true,
    },
  });
  return User;
};
