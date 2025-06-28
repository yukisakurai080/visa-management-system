import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Foreigner } from './Foreigner';
import { ApplicationTemplate } from './ApplicationTemplate';

export class GeneratedApplication extends Model {
  public id!: number;
  public foreignerId!: number;
  public templateId!: number;
  public applicationData!: any;
  public filePath!: string | null;
  public generatedAt!: Date;
  public generatedBy!: number | null;

  public readonly foreigner?: Foreigner;
  public readonly template?: ApplicationTemplate;
}

GeneratedApplication.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    foreignerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'foreigner_id',
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'template_id',
    },
    applicationData: {
      type: DataTypes.JSON,
      field: 'application_data',
    },
    filePath: {
      type: DataTypes.STRING(500),
      field: 'file_path',
    },
    generatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'generated_at',
    },
    generatedBy: {
      type: DataTypes.INTEGER,
      field: 'generated_by',
    },
  },
  {
    sequelize,
    modelName: 'GeneratedApplication',
    tableName: 'generated_applications',
    underscored: true,
    timestamps: false,
  }
);

GeneratedApplication.belongsTo(Foreigner, { foreignKey: 'foreignerId' });
GeneratedApplication.belongsTo(ApplicationTemplate, { foreignKey: 'templateId', as: 'template' });