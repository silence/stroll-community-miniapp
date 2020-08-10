import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";
import "./index.scss";

export default () => {
  const [name, setName] = useState("");
  const [cardId, setCardId] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  return (
    <AtForm
      onSubmit={() => console.log("submit")}
      onReset={() => console.log("reset")}
    >
      <AtInput
        name="name"
        title="姓名"
        type="text"
        placeholder="姓名"
        value={name}
        onChange={value => {
          console.log(value);
          setName(value as string);
        }}
      />
      <AtInput
        name="cardId"
        clear
        title="身份证号码"
        type="idcard"
        maxLength={18}
        placeholder="身份证号码"
        value={cardId}
        onChange={value => setCardId(value as string)}
      />
      <AtInput
        name="phoneNum"
        clear
        title="电话号码"
        type="phone"
        maxLength={11}
        placeholder="电话号码"
        value={phoneNum}
        onChange={value => setPhoneNum(value as string)}
      >
        <AtButton
          openType="getPhoneNumber"
          onGetPhoneNumber={ev => console.log(ev)}
        >
          获取手机号码
        </AtButton>
      </AtInput>
      <AtButton formType="submit">提交</AtButton>
      <AtButton formType="reset">重置</AtButton>
    </AtForm>
  );
};
