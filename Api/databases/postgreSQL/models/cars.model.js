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
      type: DataTypes.STRING(50),
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
      type: DataTypes.STRING(50),
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
    country: {
      type: DataTypes.STRING(255),
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
    scraper_table_row: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, {
    tableName: 'cars',
    timestamps: false, // Set to false if you don't want Sequelize to add timestamps automatically
  });

  // Defining associations
  Cars.associate = (models) => {
    // A car belongs to one make
    Cars.belongsTo(models.makes, {
      foreignKey: 'make_id',
      targetKey: 'make_id',
      as: 'make',
    });

    // A car belongs to one model
    Cars.belongsTo(models.models, {
      foreignKey: 'model_id',
      targetKey: 'model_id',
      as: 'model',
    });
  };

  return Cars;
};
