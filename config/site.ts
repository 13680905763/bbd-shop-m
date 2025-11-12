export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "bbdbuy",
  description: "Make beautiful websites regardless of your design experience.",

  toolList: [
    {
      image: "/m/images/home/Guide.png",
      title: "Guide",
    },
    {
      image: "/m/images/home/Community.png",
      title: "Community",
      // to: "/pages/member/promotion/index",
    },
    {
      image: "/m/images/home/Forwarding.png",
      title: "Forwarding",
      // to: "/pages/home/shipforme/index",
    },
    {
      image: "/m/images/home/FillBuy.png",
      title: "Fill & Buy",
    },
  ],
  toolTab: [
    {
      image: "/m/images/home/tab1.png",
      title: "tab1",
    },
    {
      image: "/m/images/home/tab2.png",
      title: "tab2",
      // to: "/pages/member/promotion/index",
    },
    {
      image: "/m/images/home/tab3.png",
      title: "tab3",
      // to: "/pages/home/shipforme/index",
    },
    {
      image: "/m/images/home/tab4.png",
      title: "tab4",
    },
  ],
  affiliatsList: [
    {
      title: "总奖励",
      value: "$888",
      to: "/pages/member/account/index",
    },
    {
      title: "联盟余额",
      value: "88",
      to: "/pages/member/points/index",
    },
    {
      title: "已提现金额",
      value: "88",
      to: "/pages/member/points/index",
    },
  ],
  orderList: [
    {
      title: "代购订单",
      src: "/m/images/dashboard/order.png",
      to: "/profile/order",
    },
    {
      title: "我的仓库",
      src: "/m/images/dashboard/warehouse.png",
      to: "/profile/warehouse",
    },
    {
      title: "我的运单",
      src: "/m/images/dashboard/package.png",
      to: "/profile/package",
    },
  ],
  setting: {
    changepwd: [
      {
        name: "pwd1",
        placeholder: "旧密码",
        value: "",
        type: true,
      },
      {
        name: "pwd2",
        placeholder: "新密码",
        value: "",
        type: true,
      },
      {
        name: "pwd3",
        placeholder: "确认密码",
        value: "",
        type: false,
      },
    ],
  },
  dashboardTool: [
    {
      title: "通知",
      src: "/m/images/dashboard/message.png",
      to: "/profile/message",
    },
    {
      title: "我的收藏",
      src: "/m/images/dashboard/favorite.png",
      to: "/profile/favorite",
    },
    {
      title: "收货地址",
      src: "/m/images/dashboard/address.png",
      to: "/profile/address",
    },
    {
      title: "账单地址",
      src: "/m/images/dashboard/address.png",
      to: "/profile/billing-address",
    },
    {
      title: "历史记录",
      src: "/m/images/dashboard/history.png",
      to: "/profile/history",
    },
  ],
};
