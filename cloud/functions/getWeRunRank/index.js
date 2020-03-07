// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  const sortByStepSum = (days, rawDataList) => {
    const computeSum = stepInfoList => {
      let sum = 0
      if (stepInfoList.length >= days) {
        for (let i = stepInfoList.length - 1; i >= stepInfoList.length - days; i--) {
          sum += stepInfoList[i].step
        }
        return sum
      } else {
        return stepInfoList.reduce((prev, ele) => {
          return prev.step + ele.step
        })
      }
    }
    rawDataList = rawDataList.map(el => {
      el.totalSteps = computeSum(el.stepInfoList)
      return el
    })
    return rawDataList.sort((a, b) => {
      return computeSum(b.stepInfoList) - computeSum(a.stepInfoList)
    })
  }

  try {
    const { days, offset, limit } = event
    const userRunList = await db
      .collection('userInfo')
      .aggregate()
      .lookup({
        from: 'weRun',
        localField: '_id',
        foreignField: '_id',
        as: 'userRunList'
      })
      .skip(offset)
      .limit(limit)
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$userRunList', 0]), '$$ROOT'])
      })
      .project({
        userRunList: 0
      })
      .end()
    return sortByStepSum(days, userRunList.list.slice())
    // return userRunList
  } catch (err) {
    return err
  }
}
