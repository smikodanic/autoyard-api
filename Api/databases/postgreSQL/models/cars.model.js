const { Sequelize } = require('sequelize');

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


const transmissionTypes = [
  'manual',
  'automatic',
  'other'
];


module.exports = (sequelize, DataTypes) => {
  const Cars = sequelize.define('carsMD', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    ad_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    ad_title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ad_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ad_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    make_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    model_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fuel: {
      type: DataTypes.ENUM(...fuelTypes),
      allowNull: true,
    },
    mileage_km: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    power_kw: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    engine_cc: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    year: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    transmission: {
      type: DataTypes.ENUM(...transmissionTypes),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    doors: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price_eur: {
      type: DataTypes.NUMERIC(10, 2),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    checked_at: { // date when checker was checked the "ad_url"
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    scraper_table_row: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, {
    tableName: 'cars',
    timestamps: false, // Set to false if you don't want Sequelize to add timestamps automatically
  });

  // Defining associations
  // Cars.associate = (models) => {
  //   // A car belongs to one make
  //   Cars.belongsTo(models.makesMD, {
  //     foreignKey: 'make_id',
  //     targetKey: 'make_id',
  //     as: 'make',
  //   });

  //   // A car belongs to one model
  //   Cars.belongsTo(models.modelsMD, {
  //     foreignKey: 'model_id',
  //     targetKey: 'model_id',
  //     as: 'model',
  //   });

  //   // A car belongs to one country
  //   Cars.belongsTo(models.countriesMD, {
  //     foreignKey: 'country_id',
  //     targetKey: 'country_id',
  //     as: 'country',
  //   });
  // };

  return Cars;
};

module.exports.fuelTypes = fuelTypes;
module.exports.transmissionTypes = transmissionTypes;
