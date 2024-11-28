module.exports = (sequelize, DataTypes) => {
  const ExchangeRates = sequelize.define('exchange_ratesMD', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    base_currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    target_currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    rate: {
      type: DataTypes.NUMERIC(15, 6),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'exchange_rates',
    timestamps: false,  // We don't need the default created_at/updated_at fields
    indexes: [
      {
        unique: true,
        fields: ['base_currency', 'target_currency', 'timestamp'],  // Ensures unique combination
      },
    ],
  });

  return ExchangeRates;
};
