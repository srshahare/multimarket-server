const Sequelize = require("sequelize")
const sequelize = require("../config/db.config")

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.agent = require("../models/agent.model")(sequelize, Sequelize)
db.user = require("../models/user.model")(sequelize, Sequelize)
db.sales = require("../models/sales.model")(sequelize, Sequelize)
db.member = require("../models/member.model")(sequelize, Sequelize)

db.user.hasOne(db.agent, {
    foreignKey: {
        allowNull: false
    }
})
db.user.hasOne(db.sales, {
    foreignKey: {
        allowNull: false
    }
})


module.exports = db;