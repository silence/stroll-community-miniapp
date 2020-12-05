// 云函数入口文件
const cloud = require("wx-server-sdk");
const { v4: uuidv4 } = require("uuid");
const md5 = require("md5");
const fs = require("fs");
const rp = require("request-promise");
require("dotenv").config();

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    userInfo: { openId },
    amount,
  } = event;

  /**
   * 将请求参数按ascii码从小到大排序生成序列字符串
   * @param params 请求的参数
   * @see https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=4_3
   */
  const paramsSortStr = (params) => {
    const sortedKeysList = Object.keys(params).sort();
    let str = "";
    sortedKeysList.forEach((key) => {
      str += `&${key}=${String(params[key])}`;
    });
    return str.slice(1);
  };

  /**
   * 企业付款到零钱
   * @see https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_2
   */
  //  "wx07e215ec1bc4d367"
  const mch_appid = process.env.MCH_APPID;
  //  "1601554950"
  const mchid = process.env.MCHID;
  // 随机字符串
  // "5K8264ILTKCH16CQ2502SI8ZNMTM67VS"
  const nonce_str = process.env.NONCE_STR;

  // "10000098201411111234567894"; // 唯一性字符串
  const partner_trade_no = uuidv4().split("-").join("");
  // "FORCE_CHECK"
  const check_name = process.env.CHECK_NAME;

  // 从实名信息数据库里获取真实姓名
  const realUserInfoC = db.collection("realUserInfo");
  // 提现数据库
  const withdrawNoC = db.collection("withdrawNo");
  const realUserInfoData = (await realUserInfoC.where({ _id: openId }).get())
    .data[0];
  const {
    realUserInfo: { name },
  } = realUserInfoData;
  const re_user_name = name;
  const desc = "漫步街区健康金";

  const params = {
    mch_appid,
    mchid,
    nonce_str,
    partner_trade_no,
    openid: openId,
    check_name,
    re_user_name,
    amount,
    desc,
  };
  const stringA = paramsSortStr(params);
  // @TODO 使用 .env 隐藏 .gitignore
  const stringSignTemp =
    //注：key为商户平台设置的密钥key
    // 4402210009100420693lx13551250451
    stringA + `&key=${process.env.KEY}`;
  //注：MD5签名方式
  const sign = md5(stringSignTemp).toUpperCase();

  // 用来判断返回的xml是否有err_code_des，并捕获错误信息
  const RE_err_code_des = new RegExp(
    /\<err_code_des\>\<\!\[CDATA\[(.*)\]\]\>\<\/err_code_des\>/
  );
  // 用来判断返回的xml是否有payment_no，并捕获支付序列号
  const RE_payment_no = new RegExp(
    /\<payment_no\>\<\!\[CDATA\[(.*)\]\]\>\<\/payment_no\>/
  );
  // 用来判断返回的xml是否有payment_time，并捕获支付时间
  const RE_payment_time = new RegExp(
    /\<payment_time\>\<\!\[CDATA\[(.*)\]\]\>\<\/payment_time\>/
  );

  let xmlRes = (
    await rp({
      url:
        "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers",
      method: "POST",
      agentOptions: {
        pfx: fs.readFileSync(__dirname + "/apiclient_cert.p12"),
        passphrase: mchid,
      },
      body: `<xml>
    <mch_appid>${mch_appid}</mch_appid>
    <mchid>${mchid}</mchid>
    <nonce_str>${nonce_str}</nonce_str>
    <partner_trade_no>${partner_trade_no}</partner_trade_no>
    <openid>${openId}</openid>
    <check_name>${check_name}</check_name>
    <re_user_name>${re_user_name}</re_user_name>
    <amount>${amount}</amount>
    <desc>${desc}</desc>
    <sign>${sign}</sign>
</xml>`,
    })
  ).toString("utf-8");

  let success,
    err = null;

  if (RE_err_code_des.test(xmlRes)) {
    err = RE_err_code_des.exec(xmlRes)[1];
  }
  if (RE_payment_no.test(xmlRes)) {
    success = true;
    await withdrawNoC.add({
      data: {
        _id: new Date(RE_payment_time.exec(xmlRes)[1]).getTime(),
        time: RE_payment_time.exec(xmlRes)[1],
        name: re_user_name,
        openId,
        amount,
        desc,
      },
    });
  }

  return { success, err, xmlRes };
};
