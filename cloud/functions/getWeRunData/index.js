// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const {
      userInfo: { openId },
      weRunData: {
        data: { stepInfoList }
      }
    } = event
    const weRun = db.collection('weRun')
    const isOpenIdExist = (await weRun.where({ _id: openId }).count()).total
    if (isOpenIdExist) {
      await weRun.doc(openId).set({
        data: {
          stepInfoList
        }
      })
    } else {
      await weRun.add({
        data: {
          _id: openId,
          stepInfoList
        }
      })
    }
    return {
      stepInfoList
    }
  } catch (err) {
    return err
  }
}
