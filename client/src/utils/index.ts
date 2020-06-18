import Taro from "@tarojs/taro";

export async function login() {
  try {
    const { result } = <Record<string, any>>await Taro.cloud.callFunction({
      name: "getOpenId",
      data: {}
    });
    return await Taro.setStorage({
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
  }
}

export async function uploadUserInfo() {
  try {
    const { userInfo } = await Taro.getUserInfo();
    await Taro.cloud.callFunction({
      name: "uploadUserInfo",
      data: { userInfo }
    });
    return await Taro.setStorage({
      key: "isUserInfoUploaded",
      data: true
    });
  } catch (err) {
    console.log(err);
  }
}

export interface IWeRunRank {
  stepInfoList: IStepInfo[];
  totalSteps: number;
  userInfo: Taro.UserInfo;
  _id: string;
}
export async function getWeRunRank(days: number, offset = 0, limit = 10) {
  try {
    const { result } = <Record<string, any>>await Taro.cloud.callFunction({
      name: "getWeRunRank",
      data: { days, offset, limit }
    });
    return result as IWeRunRank[];
  } catch (err) {
    console.log(err);
  }
}
/**
 * 延迟执行函数
 * @param fc 延迟执行函数
 * @param time 延迟执行时间
 */
export async function sleep(fc: Function, time: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fc());
    }, time);
  });
}
