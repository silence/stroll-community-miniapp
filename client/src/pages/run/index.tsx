import Taro, { useDidShow, useState } from "@tarojs/taro";
import { Button, View, Text } from "@tarojs/components";
import {
  AtModal,
  AtModalContent,
  AtModalAction,
  AtAccordion,
  AtList,
  AtListItem
} from "taro-ui";
import { login, getWeRunData, uploadUserInfo, IStepInfo } from "@/utils";
import "./index.scss";

export default () => {
  const [isModalShow, setModalShow] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [weRunList, setWeRunList] = useState<IStepInfo[]>([]);
  useDidShow(async () => {
    const setting = await Taro.getSetting();
    console.log(setting);
    if (
      setting.authSetting["scope.userLocation"] &&
      setting.authSetting["scope.werun"] &&
      setting.authSetting["scope.userInfo"]
    ) {
      const isLogin = await Taro.getStorage({ key: "openId" });
      console.log(isLogin);
      if (!isLogin) await login();
      const stepInfoList = await getWeRunData();
      console.log(stepInfoList);
      if (stepInfoList) setWeRunList(stepInfoList);
      const isUserInfoUploaded = await Taro.getStorage({
        key: "isUserInfoUploaded"
      });
      if (!isUserInfoUploaded) await uploadUserInfo();
    } else {
      setModalShow(true);
    }
  });
  const authorize = async () => {
    try {
      await Taro.authorize({ scope: "scope.userLocation" });
      await Taro.authorize({ scope: "scope.werun" });
      setModalShow(false);
      await login();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <AtModal isOpened={isModalShow} closeOnClickOverlay={false}>
        <AtModalContent>
          使用小程序必须要获取所需要的权限，否则无法使用哦~
        </AtModalContent>
        <AtModalAction>
          <Button openType="getUserInfo" onClick={() => authorize()}>
            确定
          </Button>
        </AtModalAction>
      </AtModal>
      <AtAccordion
        title="近1个月的步数"
        icon={{ value: "chevron-down", color: "red", size: "15" }}
        open={isOpen}
        onClick={() => setOpen(!isOpen)}
      >
        <View style={{ maxHeight: "200px", overflow: "scroll" }}>
          <AtList hasBorder={false}>
            {weRunList.map(value => {
              return (
                <AtListItem
                  title={`运动步数 ${value.step}`}
                  extraText={new Date(
                    value.timestamp * 1000
                  ).toLocaleDateString()}
                  key={value.timestamp}
                />
              );
            })}
          </AtList>
        </View>
      </AtAccordion>
      <View style={{ textAlign: "center" }}>
        <Text>今日步数: {weRunList[weRunList.length - 1].step}</Text>
      </View>
    </View>
  );

  // useDidShow(() => {
  // Taro.checkSession({
  //   success: res => console.log(res),
  //   fail: () => login()
  // })
  // })
  // const login = () => {
  //   Taro.login()
  //     .then(res => {
  //       console.log(res)
  //       if (res.code) {
  //         Taro.request({
  //           method: 'POST',
  //           url: 'http://127.0.0.1:7001/wxlogin',
  //           data: {
  //             JSCode: res.code
  //           }
  //         }).then(openid => Taro.setStorageSync('openid', openid.data.openid))
  //       }
  //     })
  //     .catch(err => console.log(err))
  // }

  // const getWeRunData = async () => {
  //   const res = await Taro.getWeRunData().catch(err => console.log('err', err))
  //   if (res) {
  //     const { encryptedData, iv } = res
  //     Taro.request({
  //       method: 'POST',
  //       url: 'http://127.0.0.1:7001/weRun/decoded',
  //       data: {
  //         encryptedData,
  //         iv,
  //         openid: Taro.getStorageSync('openid')
  //       }
  //     })
  //   }
  // }

  // const uploadUserInfo = async () => {
  //   const res = await Taro.getUserInfo().catch(err => console.log(err))
  //   if (res) {
  //     Taro.request({
  //       method: 'POST',
  //       url: 'http://127.0.0.1:7001/userInfo',
  //       data: {
  //         userInfo: res.userInfo,
  //         openid: Taro.getStorageSync('openid')
  //       }
  //     })
  //   }
  // }

  // const getWeRunRank = async () => {
  //   Taro.request({
  //     method: 'GET',
  //     url: 'http://127.0.0.1:7001/weRun/rank?days=3'
  //   })
  // }

  // const getLocation = async () => {
  //   const { latitude, longitude } = await Taro.getLocation({ type: 'wgs84', isHighAccuracy: true })
  //   Taro.request({
  //     method: 'POST',
  //     url: 'http://127.0.0.1:7001/getLocation',
  //     data: {
  //       latitude,
  //       longitude
  //     }
  //   })
  // }

  // return (
  //   <View>
  //     <AtButton onClick={() => login()}>登陆测试</AtButton>
  //     <AtButton onClick={() => getWeRunData()}>运动数据测试</AtButton>
  //     <AtButton openType="getUserInfo" onClick={() => uploadUserInfo()}>
  //       获取用户信息
  //     </AtButton>
  //     <AtButton onClick={() => getWeRunRank()}>获取用户步数排名信息</AtButton>
  //     <AtButton onClick={() => getLocation()}>获取地理位置</AtButton>
  //   </View>
  // )
};
