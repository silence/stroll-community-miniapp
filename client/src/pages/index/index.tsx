import Taro, { useDidShow } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { sleep } from "@/utils";
import "./index.scss";

export default () => {
  useDidShow(async () => {
    await sleep(() => {
      Taro.navigateBack({ delta: 1 });
    }, 3000);
  });
  return (
    <View className="content">
      <View className="grey-bg"></View>
      <View className="wrapper">
        <View className="welcome">
          <View className="text">欢迎您来到</View>
        </View>
        <View
          style={{
            background: `url('../../static/Materials/logo.png') no-repeat`,
            backgroundSize: "cover"
          }}
          className="logo"
        ></View>
        <View className="text-wrapper">
          <View className="intro">
            <View className="intro-text">世界上本没有路，</View>
            <View className="intro-text">走的人多了，</View>
            <View className="intro-text">也便成路。</View>
          </View>
          <View className="name">——鲁迅</View>
        </View>
        <View className="support">支持单位：XXXXX</View>
      </View>
    </View>
  );
};
