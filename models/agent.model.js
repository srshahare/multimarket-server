module.exports = (sequelize, Sequelize) => {
  const Agent = sequelize.define("agentsite", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    siteName: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    logo: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    agentDomain: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    officeDomain: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
  });
  return Agent;
};
