import Taro, { useState, useLayoutEffect, useEffect } from "@tarojs/taro";
import { Button, View, Text, Image } from "@tarojs/components";
import { AtModal, AtModalContent, AtModalAction, AtMessage } from "taro-ui";
import {
  login,
  getWeRunData,
  uploadUserInfo,
  IStepInfo,
  getWeRunRank,
  IWeRunRank,
  paramsSortStr,
  withdraw
} from "@/utils";
import "./index.scss";
import * as md5 from "md5";

export default () => {
  // Modal是否展示
  const [isModalShow, setModalShow] = useState(false);
  // 过去30天的运动步数
  const [weRunList, setWeRunList] = useState<IStepInfo[]>([]);
  // 过去天数运动步数总排名
  const [rankList, setRankList] = useState<IWeRunRank[]>([]);
  // 因为tab页必须先挂载，所以挂载后再跳转到展示页
  // useLayoutEffect(() => {
  //   Taro.navigateTo({ url: "../index/index" });
  // }, []);

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
      console.log("isLogin", isLogin);
      if (!isLogin) await login();
      const stepInfoList = await getWeRunData();
      console.log("stepInfoList", stepInfoList);
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
      console.log("stepInfoList", stepInfoList);
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
  if (avatarUrls.length < 3)
    avatarUrls = [...avatarUrls, ...Array(3 - avatarUrls.length).fill("")];

  console.log("avatarUrls", avatarUrls);
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
      <AtMessage />
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
      <View className="run-content">
        <Image
          src="../../static/Materials/ezgif.com-optimize.gif"
          className="run"
        ></Image>
      </View>
      <View className="text-content">
        <View>
          <Text>今日步数: {weRunList[weRunList.length - 1].step}</Text>
        </View>
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
        <View
          className="get-gold"
          onClick={async () => {
            if (Taro.getStorageSync("isRealUserInfoUploaded")) {
              // xxx 已经上传过真实信息了
              //   const partner_trade_no = "55af1e37073446d8b070a1e42e4fc392";
              //   console.log("partner_trade_no", partner_trade_no);
              //   const params: any = {
              //     mch_appid: "wx07e215ec1bc4d367",
              //     mchid: "1601554950",
              //     nonce_str: "5K8264ILTKCH16CQ2502SI8ZNMTM67VS", // 随机字符串
              //     // sign: "", // 签名
              //     partner_trade_no: partner_trade_no,
              //     // "10000098201411111234567897", // 唯一性字符串
              //     openid: "o6TTO4iy58YuL6RuKt4kP7xa2E10", // 用户openid
              //     check_name: "FORCE_CHECK",
              //     re_user_name: "刘泽章",
              //     amount: 30,
              //     desc: "漫步街区健康金"
              //   };
              //   const stringA = paramsSortStr(params);
              //   const stringSignTemp =
              //     //注：key为商户平台设置的密钥key
              //     stringA + "&key=4402210009100420693lx13551250451";
              //   console.log("stringSignTemp", stringSignTemp);
              //   const sign = md5(stringSignTemp).toUpperCase(); //注：MD5签名方式
              //   console.log("sign", sign);
              //   params.sign = sign;
              //   const res = await Taro.request({
              //     url:
              //       "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers",
              //     data: `<xml>
              //     <mch_appid>wx07e215ec1bc4d367</mch_appid>
              //     <mchid>1601554950</mchid>
              //     <nonce_str>5K8264ILTKCH16CQ2502SI8ZNMTM67VS</nonce_str>
              //     <partner_trade_no>${partner_trade_no}</partner_trade_no>
              //     <openid>o6TTO4iy58YuL6RuKt4kP7xa2E10</openid>
              //     <check_name>FORCE_CHECK</check_name>
              //     <re_user_name>刘泽章</re_user_name>
              //     <amount>30</amount>
              //     <desc>漫步街区健康金</desc>
              //     <sign>${sign}</sign>
              // </xml>`,
              //     method: "POST",
              //     header: { "content-type": "text/xml; charset=UTF-8" }
              //   });
              //   console.log("res", res);

              // Number((todayRunStep / 10000).toFixed(2));
              const amount = 0.4;
              if (amount < 0.3) {
                Taro.atMessage({
                  message: "健康金不足0.3元无法提现",
                  type: "warning"
                });
              } else {
                const res: any = await withdraw(amount);
                console.log("withdraw res", res.result);
              }
            } else {
              Taro.navigateTo({ url: "../withdraw/index" });
            }
          }}
        >
          提取健康金
        </View>
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
    </View>
  );
};
