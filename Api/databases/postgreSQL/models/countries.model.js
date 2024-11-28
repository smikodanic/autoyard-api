module.exports = (sequelize, DataTypes) => {
  return sequelize.define('countriesMD', {
    country_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, // Ensures country names are unique
    },
  }, {
    tableName: 'countries',
    timestamps: false, // Set to true if you want `created_at` and `updated_at` fields automatically added
  });
};
