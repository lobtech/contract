const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Dragon extends Model {}
Dragon.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tokenId: DataTypes.STRING,
  name: DataTypes.STRING,
  image: DataTypes.STRING
}, { sequelize, modelName: 'dragons' });

(async () => {
  await sequelize.sync();
  const jane = await Dragon.create({
    name: 'janedoe',
    image: "https://www.google.com"
  });
  console.log(jane.toJSON());
})();

module.exports = {
  Dragon,
};
