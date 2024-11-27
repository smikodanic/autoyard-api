module.exports = (sequelize, DataTypes) => {

  return sequelize.define('scraper_theparking_euMD', {
    car_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    searchpage_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    searchpage_url: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    car_detail_url: {
      type: DataTypes.STRING(400),
      allowNull: false,
      unique: true,  // Add a unique constraint here for upsert()
    },
    redirect_url: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    external_url: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    price_unit: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: '€'
    },
    image_url: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    date_published: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fuel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mileage_km: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    transmission: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    doors: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ad_title: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    crawled_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      primaryKey: true
    }
  }, {
    tableName: 'scraper_theparking_eu',
    timestamps: false,
  });

};
