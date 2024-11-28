const fuelTypes = [
  'gasoline',
  'diesel',
  'electric',
  'hydrogen',
  'hybrid',
  'ethanol',
  'methanol',
  'solar',
  'LPG (Liquefied Petroleum Gas)',
  'NGV (Natural Gas Vehicle)',
  'CNG (Compressed Natural Gas)',
  'PHEV (Plug In Hybrid Electric Vehicle)',
  'DME (Dimethyl Ether)',
  'other'
];


module.exports = (sequelize, DataTypes) => {
  return sequelize.define('fuelsMD', {
    fuel_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.ENUM(...fuelTypes),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'fuels',
    timestamps: false,
  });
};


module.exports.fuelTypes = fuelTypes;

