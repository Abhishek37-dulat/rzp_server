import { Sequelize } from "sequelize";

const sequelize = new Sequelize("newdatastorage", "root", "funtolaughAD@123", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
