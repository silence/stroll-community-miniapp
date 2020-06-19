import Taro, { useEffect, useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtModal } from "taro-ui";
import { sleep } from "@/utils";
import "./index.scss";

export default () => {
  // 首页介绍modal是否打开
  const [isOpened, setIsOpened] = useState(false);
  useEffect(() => {
    const isIntro: true | "" = Taro.getStorageSync("isIntro");
    if (isIntro !== "") {
      setIsOpened(() => false);
      (async () => await sleep(() => Taro.navigateBack({ delta: 1 }), 3000))();
    } else {
      setIsOpened(() => true);
    }
  }, [isOpened]);
  return (
    <View className="content">
      <AtModal
        isOpened={isOpened}
        closeOnClickOverlay={false}
        title="活动介绍"
        confirmText="确认"
        onConfirm={() => {
          Taro.setStorageSync("isIntro", true);
          setIsOpened(() => false);
        }}
        content="这里是活动介绍内容，欢迎来到漫步街区小程序
        这里是活动介绍内容，欢迎来到漫步街区小程序
        这里是活动介绍内容，欢迎来到漫步街区小程序"
      />
      <View className="grey-bg"></View>
      <View className="wrapper">
        <View className="welcome">
          <View className="text">欢迎您来到</View>
        </View>
        <View
          style={{
            backgroundImage: `url('../../static/Materials/logo.png')`,
            backgroundSize: "cover"
          }}
          className="logo"
        ></View>
        <View className="text-wrapper">
          <View className="intro">
            <View className="intro-text">世界上本没有路，</View>
            <View className="intro-text">走的人多了，</View>
            <View className="intro-text">也便成了路。</View>
          </View>
          <View className="name">——鲁迅</View>
        </View>
        <View className="support">支持单位：XXXXX</View>
      </View>
    </View>
  );
};
