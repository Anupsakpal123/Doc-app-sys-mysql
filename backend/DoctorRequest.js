const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const DoctorRequest = sequelize.define(
  "DoctorRequest",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    specialist: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fees: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
    },
  },
  {
    tableName: "DoctorRequests",
    timestamps: true,
  }
);

module.exports = DoctorRequest;
