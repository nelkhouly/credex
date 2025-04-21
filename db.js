import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('credex', 'root', 'sql123$', {
  host: 'localhost',
  dialect: 'mysql'
});

export default sequelize;