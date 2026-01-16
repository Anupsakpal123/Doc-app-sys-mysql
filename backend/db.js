const {Sequelize} = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME,
    process.env.DB_USER, process.env.DB_PASSWORD,{
        host:process.env.DB_HOST || 'localhost',
        port:process.env.DB_PORT || 3306,
        dialect:'mysql',
        define:{
            timestamps:true
        }
    }
)
async function testConnection(){
    try {
        await sequelize.authenticate()
        console.log("✅databse connected successsfully..")
    } catch (error) {
        console.log("error while connection")
    }
}
syncDB = async(force=false, alter=false)=>{
    try {
        await sequelize.sync(force, alter)
        console.log("✅All models are synchronized successfully")
    } catch (error) {
        console.error('error syncing models:', error)
    }
}
syncDB()

module.exports = {testConnection, sequelize}