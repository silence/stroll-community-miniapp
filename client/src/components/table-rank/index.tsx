import Taro, { useEffect, useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { IWeRunRank } from "@/utils";

interface IProps {
  rankList: IWeRunRank[];
}
export default (props: IProps) => {
  const { rankList } = props;
  const [openId, setOpenId] = useState("");
  const [selfInfo, setSelfInfo] = useState({} as IWeRunRank);
  const [rank, setRank] = useState<number>(0);

  useEffect(() => {
    setOpenId(Taro.getStorageSync("openId"));
  }, []);

  if (openId !== "") {
    console.log("openId", openId);
    setSelfInfo(rankList.filter(el => el._id === openId)[0]);
  }

  if (rankList && rankList.length !== 0) {
    rankList.map((el, index) => {
      if (el._id === openId) {
        setRank(index + 1);
      }
    });
  }

  return (
    <View className="content">
      <View className="title">活力排行</View>
      <View className="wrapper">
        <View className="title">
          <View className="rank-number">{rank}</View>
          <View className="rank">名</View>
          <View
            className="avatar"
            style={{
              backgroundImage: `url(${selfInfo.userInfo &&
                selfInfo.userInfo.avatarUrl})`,
              backgroundSize: "cover"
            }}
          ></View>
          <View className="step-number">{selfInfo.totalSteps}</View>
          <View className="step">步</View>
        </View>
      </View>
      {rankList &&
        rankList.length !== 0 &&
        rankList.map((el, index) => {
          return (
            <View
              className="table-cell"
              style={{
                marginTop: index === 0 ? "29rpx" : 0,
                backgroundColor: index % 2 === 0 ? "#efefef" : "#ffffff"
              }}
            >
              <View
                className="left"
                style={{
                  backgroundImage: (value => {
                    switch (value) {
                      case 1:
                        return `url('../../static/Materials/Ranking/Gold.png')`;
                      case 2:
                        return `url('../../static/Materials/Ranking/Silver.png')`;
                      case 3:
                        return `url('../../static/Materials/Ranking/Bronze.png')`;
                      default:
                        return "";
                    }
                  })(index + 1)
                }}
              >
                {index === 0 || index === 1 || index === 2 ? null : index + 1}
              </View>
              <View
                className="avatar"
                style={{
                  backgroundImage: `url(${el.userInfo.avatarUrl})`,
                  backgroundSize: "cover"
                }}
              ></View>
              <View className="name">{el.userInfo.nickName}</View>
              <View className="number">{el.totalSteps}</View>
            </View>
          );
        })}
    </View>
  );
};
