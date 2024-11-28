module.exports = (sequelize, DataTypes) => {

  return sequelize.define('makesMD', {
    make_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'makes',
    timestamps: false,
  });

};
