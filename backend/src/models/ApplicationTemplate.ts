import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { VisaStatus } from './VisaStatus';

export class ApplicationTemplate extends Model {
  public id!: number;
  public name!: string;
  public code!: string | null;
  public visaStatusId!: number | null;
  public templateType!: string | null;
  public templateContent!: any;
  public formFields!: any;
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly visaStatus?: VisaStatus;
}

ApplicationTemplate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    visaStatusId: {
      type: DataTypes.INTEGER,
      field: 'visa_status_id',
    },
    templateType: {
      type: DataTypes.STRING(50),
      field: 'template_type',
    },
    templateContent: {
      type: DataTypes.JSON,
      field: 'template_content',
    },
    formFields: {
      type: DataTypes.JSON,
      field: 'form_fields',
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'ApplicationTemplate',
    tableName: 'application_templates',
    underscored: true,
  }
);

ApplicationTemplate.belongsTo(VisaStatus, { foreignKey: 'visaStatusId' });