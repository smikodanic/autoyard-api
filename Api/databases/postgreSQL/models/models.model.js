module.exports = (sequelize, DataTypes) => {

  return sequelize.define('modelsMD', {
    model_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  }, {
    tableName: 'models',
    timestamps: false,
  });

};
