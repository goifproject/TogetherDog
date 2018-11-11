const API = require('.')
const sharp = require('sharp')
const fs = require('fs')
const Path = require('path')

class ImageAPI {
  async upload(file) {
    const data = {
      filename: file.filename,
      org_filename: file.originalname,
      mimetype: file.mimetype
    }
    return await API.Image.create(data)
  }
  async delete( id) {
    const image = await API.Image.findOne({ attributes: ['filename'], where: { id: id }})
    return new Promise(async (resolve, reject) => {
      //if(image.get('user_id') === user.id) {
        await fs.unlinkSync(Path.resolve(__dirname, '../uploads', './' + image.get('filename')))
        if(await API.Image.destroy({returning: true, where: { id: id }}))
        resolve()
        else
        reject('Error while delete image')
      // } else {
      //   reject('You don\'t have permission to do this.')
      // }
    })
  }
	async getList() {
		return new Promise(async (resolve, reject) => {
      const data = await API.Image.findAll({attributes: ['id']})
      if(data.length === 0) reject('Empty')
      else {
        const list = []
        for(var i=0;i<data.length;i++) list.push(data[i].id)
        resolve(list)
      }
    })
	}
  async getFile(id) {
		const image = await API.Image.findOne({ attributes: ['filename', 'org_filename', 'mimetype'], where: { id: id } })
		if(!image) return undefined
		else if(/*image.user_id == user.id*/true) return image
		else return undefined
	}
	async resizeImage(path, size) {
		return await sharp(path).resize(size).toBuffer()
	}
}

module.exports = new ImageAPI()
