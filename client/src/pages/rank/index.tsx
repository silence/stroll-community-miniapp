import Taro, { useDidShow, useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { getWeRunRank, IWeRunRank } from "@/utils";
import "./index.scss";
import TableRank from "@/components/table-rank";

export default () => {
  const [rankList, setRankList] = useState<IWeRunRank[]>([]);
  useDidShow(async () => {
    const res = await getWeRunRank(1);
    console.log(res);
    if (res) setRankList(res);
  });
  console.log(rankList);
  return (
    <View>
      <TableRank rankList={rankList} />
    </View>
  );
};

/* <AtList hasBorder={false}>
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
      </AtList> */
