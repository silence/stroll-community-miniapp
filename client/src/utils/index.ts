import Taro from "@tarojs/taro";

/**
 * 登陆函数
 * 设置 {openId: xxx} 到storage里
 */
export async function login() {
  try {
    const { result } = <Record<string, any>>await Taro.cloud.callFunction({
      name: "getOpenId",
      data: {}
    });
    await Taro.setStorage({
      key: "openId",
      data: result.openId
    });
  } catch (err) {
    console.log(err);
  }
}

export interface IStepInfo {
  step: number;
  timestamp: number;
}

/**
 * 获取用户过去30天的运动步数
 */
export async function getWeRunData() {
  try {
    const { cloudID } = await Taro.getWeRunData();
    const { result } = <Record<string, any>>await Taro.cloud.callFunction({
      name: "getWeRunData",
      data: {
        weRunData: wx.cloud.CloudID(cloudID)
      }
    });
    return result.stepInfoList as IStepInfo[];
  } catch (err) {
    console.log(err);
    return [];
  }
}

/**
 * 获取用户的手机号信息
 */
export async function getPhoneNumber({ cloudID }) {
  try {
    const { result } = <any>await Taro.cloud.callFunction({
      name: "getPhoneNum",
      data: {
        phoneNumber: wx.cloud.CloudID(cloudID)
      }
    });
    console.log("cloud->getPhoneNum", result);
    return result.phoneNumber as string;
  } catch (err) {
    console.log(err);
    return "";
  }
}
/**
 * 上传用户真实信息
 * 上传成功会设置 {isRealUserInfoUploaded: true} 到 storage
 * @param realUserInfo 包含姓名、身份证号、手机号
 */
export async function uploadRealUserInfo(realUserInfo) {
  try {
    await Taro.cloud.callFunction({
      name: "uploadRealUserInfo",
      data: { realUserInfo }
    });
    await Taro.setStorage({
      key: "isRealUserInfoUploaded",
      data: true
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * 上传用户信息
 * 上传成功会设置 {isUserInfoUploaded: true} 到 storage
 */
export async function uploadUserInfo() {
  try {
    const { userInfo } = await Taro.getUserInfo();
    await Taro.cloud.callFunction({
      name: "uploadUserInfo",
      data: { userInfo }
    });
    await Taro.setStorage({
      key: "isUserInfoUploaded",
      data: true
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * 请求提现健康金云函数
 * @param amount 单位：元
 */
export async function withdraw(amount: number) {
  try {
    return await Taro.cloud.callFunction({
      name: "withdraw",
      data: {
        // 单位：分
        amount: amount * 100
      }
    });
  } catch (err) {
    console.log(err);
    return {};
  }
}
export interface IWeRunRank {
  stepInfoList: IStepInfo[];
  totalSteps: number;
  userInfo: Taro.UserInfo;
  _id: string;
}

/**
 * 获取过去几天的步数排行榜
 * @param days 过去的天数
 * @param offset 偏移值
 * @param limit 限制条数
 */
export async function getWeRunRank(days: number, offset = 0, limit = 10) {
  try {
    const { result } = <Record<string, any>>await Taro.cloud.callFunction({
      name: "getWeRunRank",
      data: { days, offset, limit }
    });
    return result as IWeRunRank[];
  } catch (err) {
    console.log(err);
    return [];
  }
}

/**
 * 延迟执行函数
 * @param fc 延迟执行函数
 * @param time 延迟执行时间 ms
 */
export async function sleep(fc: Function, time: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fc());
    }, time);
  });
}
