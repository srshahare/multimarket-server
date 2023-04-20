module.exports = (sequelize, Sequelize) => {
    const Member = sequelize.define("member", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        required: true,
      },
      username: {
        type: Sequelize.STRING,
        required: true,
      },
      logo: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      passwordHash: {
        type: Sequelize.STRING,
        required: true,
      },
    });
    return Member;
  };
  