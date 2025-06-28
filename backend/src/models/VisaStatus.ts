import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class VisaStatus extends Model {
  public id!: number;
  public code!: string;
  public name!: string;
  public nameEn!: string | null;
  public category!: string | null;
  public maxPeriod!: string | null;
  public workPermitted!: boolean;
  public description!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VisaStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    nameEn: {
      type: DataTypes.STRING(100),
      field: 'name_en',
    },
    category: {
      type: DataTypes.STRING(50),
    },
    maxPeriod: {
      type: DataTypes.STRING(50),
      field: 'max_period',
    },
    workPermitted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'work_permitted',
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'VisaStatus',
    tableName: 'visa_statuses',
    underscored: true,
  }
);