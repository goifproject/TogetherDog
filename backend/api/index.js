const Sequelize = require('sequelize')

const API = new Sequelize('main', 'root', 'asdf1234', {
	host: 'localhost',
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	operatorsAliases: false,
	timezone: '+09:00',
	dialectOptions: {
		charset: 'utf8mb4'
	},
	define: {
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	}
})

API.User = User = API.define('user', {
	id: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
	username: { type: Sequelize.STRING(16), allowNull: false },
	password: { type: Sequelize.CHAR(64), allowNull: false },
	name: { type: Sequelize.STRING(5), allowNull: false },
	zipcode: { type: Sequelize.CHAR(5), allowNull: false },
	address1: { type: Sequelize.STRING(100), allowNull: false },
	address2: { type: Sequelize.STRING(100), allowNull: false },
	phone: { type: Sequelize.STRING(11), allowNull: false },
})

API.Image = Image = API.define('image', {
	id: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
	// user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
	filename: { type: Sequelize.STRING(45), allowNull: false },
	org_filename: { type: Sequelize.STRING(45), allowNull: false },
	mimetype: { type: Sequelize.STRING(15), allowNull: false },
})
// Image.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'})

API.sync({alter: true})

module.exports = API
