import Taro, { useState, useLayoutEffect, useEffect } from "@tarojs/taro";
import { Button, View, Text, Image } from "@tarojs/components";
import { AtModal, AtModalContent, AtModalAction } from "taro-ui";
import {
  login,
  getWeRunData,
  uploadUserInfo,
  IStepInfo,
  getWeRunRank,
  IWeRunRank
} from "@/utils";
import "./index.scss";

export default () => {
  const [isModalShow, setModalShow] = useState(false);
  const [weRunList, setWeRunList] = useState<IStepInfo[]>([]);
  const [rankList, setRankList] = useState<IWeRunRank[]>([]);
  // const [avatarUrls, setAvatarUrls] = useState<string[]>([]);
  useLayoutEffect(() => {
    Taro.navigateTo({ url: "../index/index" });
  }, []);
  // @ts-ignore
  useEffect(async () => {
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
      const res = await getWeRunRank(30, 0, 3);
      console.log(res);
      if (res) setRankList(res);
      const isUserInfoUploaded = await Taro.getStorage({
        key: "isUserInfoUploaded"
      });
      if (!isUserInfoUploaded) await uploadUserInfo();
    } else {
      setModalShow(true);
    }
  }, [weRunList.length]);
  const authorize = async () => {
    try {
      await Taro.authorize({ scope: "scope.userLocation" });
      await Taro.authorize({ scope: "scope.werun" });
      setModalShow(false);
      await login();
      const stepInfoList = await getWeRunData();
      console.log(stepInfoList);
      if (stepInfoList) setWeRunList(stepInfoList);
      await uploadUserInfo();
    } catch (err) {
      console.log(err);
    }
  };
  let avatarUrls = [""];
  if (rankList.length !== 0) {
    avatarUrls = rankList.map(el => el.userInfo.avatarUrl);
  }

  console.log(avatarUrls);
  let todayRunStep = 0;
  if (weRunList.length !== 0) {
    todayRunStep = weRunList[weRunList.length - 1].step;
  }

  if (todayRunStep > 25000) todayRunStep = 25000;

  const loadingBG = (todayRunStep => {
    if (todayRunStep >= 0 && todayRunStep < 3000) {
      return "#b7e9ac";
    } else if (todayRunStep >= 3000 && todayRunStep < 7000) {
      return "#edffb4";
    } else if (todayRunStep >= 7000 && todayRunStep < 12000) {
      return "#fcfe86";
    } else if (todayRunStep >= 12000 && todayRunStep < 18000) {
      return "#f5d45c";
    } else if (todayRunStep >= 18000 && todayRunStep < 25000) {
      return "#e19537";
    } else if (todayRunStep >= 25000) {
      return "#f79c6b";
    }
  })(todayRunStep);

  return (
    <View className="content">
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
      {/* <AtAccordion
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
      </AtAccordion> */}
      <View className="run-content">
        <Image
          src="../../static/Materials/ezgif.com-optimize.gif"
          className="run"
        ></Image>
      </View>
      <View className="text-content">
        <View className="text">No surprise 原则</View>
      </View>
      <View className="health-content">
        <View className="energy-value">
          <View className="text">活力值</View>
          <View className="loading"></View>
          <View
            className="energy-loading"
            style={{
              width: `${(56.7 * todayRunStep) / 25000}vw`,
              backgroundColor: loadingBG
            }}
          ></View>
          <View className="description">
            活力值说明：当达到一定活力值会有健康金
          </View>
        </View>
        <View className="health-gold">
          <View className="text">健康金</View>
          <View className="health-value">
            {(todayRunStep / 10000).toFixed(2)}
          </View>
        </View>
        <View className="get-gold">获取健康金</View>
      </View>
      <View className="energy-rank">
        <View className="text">活力榜单</View>
        <View className="wrapper">
          <View className="left-box">
            <View
              className="top"
              style={{ backgroundImage: `url(${avatarUrls[1]})` }}
            ></View>
            <View className="bottom"></View>
          </View>
          <View className="middle-box">
            <View
              className="top"
              style={{ backgroundImage: `url(${avatarUrls[0]})` }}
            ></View>
            <View className="bottom"></View>
          </View>
          <View className="right-box">
            <View
              className="top"
              style={{ backgroundImage: `url(${avatarUrls[2]})` }}
            ></View>
            <View className="bottom"></View>
          </View>
        </View>
      </View>

      <View style={{ textAlign: "center", color: "#fff" }}>
        <Text>今日步数: {weRunList[weRunList.length - 1].step}</Text>
      </View>
    </View>
  );
};
