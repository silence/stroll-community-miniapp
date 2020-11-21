// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { realUserInfo } = event;
    const { OPENID } = cloud.getWXContext();
    const openId = OPENID;
    const realUserInfoC = db.collection("realUserInfo");
    const isOpenIdExist = (await realUserInfoC.where({ _id: openId }).count())
      .total;
    if (isOpenIdExist) {
      await realUserInfoC.doc(openId).set({
        data: {
          realUserInfo,
        },
      });
    } else {
      await realUserInfoC.add({
        data: {
          _id: openId,
          realUserInfo,
        },
      });
    }
  } catch (err) {
    return err;
  }
};
