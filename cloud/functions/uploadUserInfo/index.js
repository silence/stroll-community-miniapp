// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { userInfo } = event
    const { OPENID } = cloud.getWXContext()
    const openId = OPENID
    const weRun = db.collection('userInfo')
    const isOpenIdExist = (await weRun.where({ _id: openId }).count()).total
    if (isOpenIdExist) {
      await weRun.doc(openId).set({
        data: {
          userInfo
        }
      })
    } else {
      await weRun.add({
        data: {
          _id: openId,
          userInfo
        }
      })
    }
  } catch (err) {
    return err
  }
}
