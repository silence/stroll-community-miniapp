// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const {
      userInfo: { openId },
      phoneNumber: {
        data: { phoneNumber },
      },
    } = event;
    const phoneNum = db.collection("phoneNum");
    const isOpenIdExist = (await phoneNum.where({ _id: openId }).count()).total;
    if (isOpenIdExist) {
      await phoneNum.doc(openId).set({
        data: {
          phoneNumber,
        },
      });
    } else {
      await phoneNum.add({
        data: {
          _id: openId,
          phoneNumber,
        },
      });
    }
    return {
      phoneNumber,
    };
  } catch (err) {
    return err;
  }
};
