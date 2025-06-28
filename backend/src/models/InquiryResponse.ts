import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class InquiryResponse extends Model {
  public id!: number;
  public inquiryType!: string | null;
  public respondentName!: string | null;
  public respondentEmail!: string | null;
  public respondentPhone!: string | null;
  public formData!: any;
  public processed!: boolean;
  public processedAt!: Date | null;
  public readonly createdAt!: Date;
}

InquiryResponse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    inquiryType: {
      type: DataTypes.STRING(50),
      field: 'inquiry_type',
    },
    respondentName: {
      type: DataTypes.STRING(255),
      field: 'respondent_name',
    },
    respondentEmail: {
      type: DataTypes.STRING(255),
      field: 'respondent_email',
      validate: {
        isEmail: true,
      },
    },
    respondentPhone: {
      type: DataTypes.STRING(20),
      field: 'respondent_phone',
    },
    formData: {
      type: DataTypes.JSON,
      field: 'form_data',
    },
    processed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    processedAt: {
      type: DataTypes.DATE,
      field: 'processed_at',
    },
  },
  {
    sequelize,
    modelName: 'InquiryResponse',
    tableName: 'inquiry_responses',
    underscored: true,
    updatedAt: false,
  }
);