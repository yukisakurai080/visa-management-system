import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Country } from './Country';
import { VisaStatus } from './VisaStatus';

export class Foreigner extends Model {
  public id!: number;
  public residenceCardNumber!: string | null;
  public lastName!: string;
  public firstName!: string;
  public lastNameKana!: string | null;
  public firstNameKana!: string | null;
  public lastNameEn!: string | null;
  public firstNameEn!: string | null;
  public gender!: 'M' | 'F' | 'OTHER' | null;
  public dateOfBirth!: Date;
  public countryId!: number | null;
  public passportNumber!: string | null;
  public currentVisaStatusId!: number | null;
  public visaExpiryDate!: Date | null;
  public address!: string | null;
  public phoneNumber!: string | null;
  public email!: string | null;
  public employerName!: string | null;
  public notes!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly country?: Country;
  public readonly currentVisaStatus?: VisaStatus;
}

Foreigner.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    residenceCardNumber: {
      type: DataTypes.STRING(20),
      unique: true,
      field: 'residence_card_number',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name',
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name',
    },
    lastNameKana: {
      type: DataTypes.STRING(100),
      field: 'last_name_kana',
    },
    firstNameKana: {
      type: DataTypes.STRING(100),
      field: 'first_name_kana',
    },
    lastNameEn: {
      type: DataTypes.STRING(100),
      field: 'last_name_en',
    },
    firstNameEn: {
      type: DataTypes.STRING(100),
      field: 'first_name_en',
    },
    gender: {
      type: DataTypes.ENUM('M', 'F', 'OTHER'),
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_of_birth',
    },
    countryId: {
      type: DataTypes.INTEGER,
      field: 'country_id',
    },
    passportNumber: {
      type: DataTypes.STRING(50),
      field: 'passport_number',
    },
    currentVisaStatusId: {
      type: DataTypes.INTEGER,
      field: 'current_visa_status_id',
    },
    visaExpiryDate: {
      type: DataTypes.DATEONLY,
      field: 'visa_expiry_date',
    },
    address: {
      type: DataTypes.TEXT,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      field: 'phone_number',
    },
    email: {
      type: DataTypes.STRING(255),
    },
    employerName: {
      type: DataTypes.STRING(255),
      field: 'employer_name',
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'Foreigner',
    tableName: 'foreigners',
    underscored: true,
    indexes: [
      {
        fields: ['visa_expiry_date'],
      },
      {
        fields: ['residence_card_number'],
      },
    ],
  }
);

Foreigner.belongsTo(Country, { foreignKey: 'countryId' });
Foreigner.belongsTo(VisaStatus, { foreignKey: 'currentVisaStatusId', as: 'currentVisaStatus' });