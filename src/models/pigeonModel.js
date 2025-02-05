import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from '../../config/database.js';

// export const Pigeon = sequelize.define(
//     "pigeons",
//     {
//       anilha: Sequelize.STRING,
//       foto_path: Sequelize.STRING,
//       created_at: Sequelize.DATE,
//       updated_at: Sequelize.DATE,
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

export const Pigeon = sequelize.define(
  'Pigeon',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    anilha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foto_path: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    father_anilha: {
      type: DataTypes.STRING,
    },
    mother_anilha: {
      type: DataTypes.STRING
    },
    sex: {
      type: DataTypes.CHAR(1)
    },
    description: {
      type: DataTypes.TEXT,
    }
  },
  {
    tableName: 'pombos',
    timestamps: false,
  }
);