module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'modelsMD',
    {
      model_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      make_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'makes', // Name of the referenced table
          key: 'make_id' // Name of the referenced column
        },
        onUpdate: 'CASCADE', // if make_id is updated in "makes" table it will automatically update models.make_id
        onDelete: 'CASCADE'  // if make_id is deleted in "makes" table it will automatically delete models.make_id
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      tableName: 'models',
      timestamps: false
    }
  );
};

