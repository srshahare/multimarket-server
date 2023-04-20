module.exports = (sequelize, Sequelize) => {
  const SalesSite = sequelize.define("salessite", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    eComDomain: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    customerDomain: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    siteName: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
  });
  return SalesSite;
};
