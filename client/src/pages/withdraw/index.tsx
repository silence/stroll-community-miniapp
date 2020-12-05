import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  AtForm,
  AtInput,
  AtButton,
  AtModal,
  AtToast,
  AtMessage
} from "taro-ui";
import "./index.scss";
import { getPhoneNumber, sleep, uploadRealUserInfo } from "@/utils";

export default () => {
  const [name, setName] = useState("");
  const [cardId, setCardId] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [isModalShow, setModalShow] = useState(true);
  const [isToastShow, setToastShow] = useState(false);
  const [toastText, setToastText] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  return (
    <View>
      <AtToast isOpened={isToastShow} text={toastText}></AtToast>
      <AtModal
        isOpened={isModalShow}
        title="提取健康金注意事项"
        cancelText="取消"
        confirmText="确认"
        onCancel={() => Taro.navigateBack({ delta: 1 })}
        onConfirm={() => setModalShow(false)}
        content="提取健康金需要提供真实姓名、身份证以及手机号相关信息"
      />
      <AtForm
        onSubmit={async () => {
          if (!/^[\u4e00-\u9fa5]+$/.test(name)) {
            setToastText("输入的姓名不正确");
            setToastShow(true);
            return;
          }
          if (
            !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
              cardId
            )
          ) {
            setToastText("输入的身份证号不正确");
            setToastShow(true);
            return;
          }
          if (
            !/^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[235-8]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|66\d{2})\d{6}$/.test(
              phoneNum
            )
          ) {
            setToastText("输入的手机号码不正确");
            setToastShow(true);
            return;
          }
          setSubmitLoading(true);
          setToastShow(false);
          await uploadRealUserInfo({
            name,
            cardId,
            phoneNum
          });
          Taro.atMessage({
            message: "提交成功",
            type: "success"
          });
          await sleep(() => {
            Taro.navigateBack({ delta: 1 });
          }, 3000);
          setSubmitLoading(false);
        }}
        onReset={() => {
          setName("");
          setCardId("");
          setPhoneNum("");
        }}
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
            loading={phoneLoading}
            onGetPhoneNumber={async ev => {
              console.log("getPhoneNumberRes", ev);
              setPhoneLoading(true);
              const phoneNumber = await getPhoneNumber(ev.detail as any);
              setPhoneNum(phoneNumber as string);
              setPhoneLoading(false);
            }}
          >
            获取手机号码
          </AtButton>
        </AtInput>
        <View className="form-control">
          <AtButton formType="submit" type="primary" loading={submitLoading}>
            提交
          </AtButton>
          <AtButton formType="reset">重置</AtButton>
        </View>
      </AtForm>
      <AtMessage />
    </View>
  );
};
