import Taro, { useDidShow, useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { getWeRunRank, IWeRunRank } from "@/utils";
import TableRank from "@/components/table-rank";
import "./index.scss";

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
