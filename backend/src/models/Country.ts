import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Country extends Model {
  public id!: number;
  public code!: string;
  public nameJa!: string;
  public nameEn!: string;
  public readonly createdAt!: Date;
}

Country.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
    },
    nameJa: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'name_ja',
    },
    nameEn: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'name_en',
    },
  },
  {
    sequelize,
    modelName: 'Country',
    tableName: 'countries',
    underscored: true,
    updatedAt: false,
  }
);