import Taro, { useDidShow, useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui";
import { getWeRunRank, IWeRunRank } from "@/utils";
import "./index.scss";

export default () => {
  const [rankList, setRankList] = useState<IWeRunRank[]>([]);
  useDidShow(async () => {
    const res = await getWeRunRank(5);
    console.log(res);
    if (res) setRankList(res);
  });
  return (
    <View>
      <AtList hasBorder={false}>
        {rankList.map(el => {
          return (
            <AtListItem
              thumb={el.userInfo.avatarUrl}
              note={el.userInfo.city}
              title={el.userInfo.nickName}
              extraText={el.totalSteps.toString()}
              key={el.userInfo.avatarUrl}
            />
          );
        })}
      </AtList>
    </View>
  );
};
