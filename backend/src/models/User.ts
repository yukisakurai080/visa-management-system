import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcryptjs';

export class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public passwordHash!: string;
  public role!: 'admin' | 'staff' | 'viewer';
  public active!: boolean;
  public lastLogin!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    role: {
      type: DataTypes.ENUM('admin', 'staff', 'viewer'),
      defaultValue: 'staff',
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      field: 'last_login',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash) {
          user.passwordHash = await User.hashPassword(user.passwordHash);
        }
      },
    },
  }
);