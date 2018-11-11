const API = require('.')
const SHA256 = require("crypto-js/sha256")

class UserAPI {
	async signup(data) {
		function cL(val, min, max) {
			return min <= val.length && val.length <= max
		}
		return new Promise(async (resolve, reject) => {
			if (!data.username ||
				!data.password ||
				!data.name ||
				!data.zipcode ||
				!data.address1 ||
				!data.address2 ||
				!data.phone) return reject('All entries are required.')
			if (!cL(data.username, 3, 16) ||
				!cL(data.password, 8, 30) ||
				!cL(data.name, 2, 5) ||
				!cL(data.zipcode, 5, 5) ||
				!cL(data.address1, 5, 50) ||
				!cL(data.address2, 0, 50) ||
				!cL(data.phone, 11, 11)) return reject('The number of characters is incorrect.')
			if (!/^[a-zA-Z0-9_]+$/g.test(data.username)) return reject('Username is incorrect')
			if (!/^[a-zA-Z0-9~!@\#$%<>^&*()\-=+_\’]+$/g.test(data.password)) return reject('Password is incorrect')
			data.password = SHA256(data.password).toString()
			API.User.create(data).then(data => {
				resolve(data.toJSON())
			}).catch(err => {
				reject(err)
			})
		})
	}
	async get(id) {
		return await API.User.findOne({attributes: ['id', 'username', 'name', 'phone'], where: {id: id}})
	}
	async login (username, password, permission) {
		return new Promise (async (resolve, reject) => {
			const data = await API.User.findOne({where:{username: username, password: SHA256(password).toString(), permission: permission || 'U'}})
			if(data) resolve(data.toJSON())
			else reject('Cannot find account.')
		})
	}
	async checkAvailability (column, value) {
		const query = {}
		query[column] = value
		return new Promise(async (resolve, reject) => {
			const data = await API.User.findOne({where:query})
			if(data) reject('Already exist.')
			else resolve()
		})
	}
}
	
module.exports = new UserAPI()
