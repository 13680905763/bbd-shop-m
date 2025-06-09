export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "bbdbuy",
  description: "Make beautiful websites regardless of your design experience.",

  toolList: [
    {
      image: "https://bbdbuy.com/assets/flagship/img/Discord.png",
      title: "discord",
    },
    {
      image: "https://bbdbuy.com/assets/flagship/img/OrderPage.png",
      title: "forwarding",
      to: "/pages/home/shipforme/index",
    },
    {
      image: "https://bbdbuy.com/assets/flagship/img/Affiliates.png",
      title: "invite friends",
      to: "/pages/member/promotion/index",
    },
    {
      image: "https://bbdbuy.com/assets/flagship/img/telegram.png",
      title: "telegram",
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
      to: "/pages/member/score/index",
    },
    {
      title: "已提现金额",
      value: "88",
      to: "/pages/member/score/index",
    },
  ],
  orderList: [
    {
      title: "代购订单",
      src: "data:image/png;base64,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",
      to: "/pages/me/order/order",
    },
    {
      title: "我的仓库",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABdCAYAAAAoswH9AAAACXBIWXMAAAsSAAALEgHS3X78AAAOT0lEQVR4nO2dC5AURxnH/z2zt4/bvdu9x94dXOAOA5JU4O44NM9LACEx0SRQpQkhPoDkYiyrTDDGlGWVCdEYS60oWpoqSyMHVillqUVMKaUl4ZGXJBEORELghDvg4I5w4V773p22umd2d3Z39jmz92I/btjZnu7pb37b883XPTP9EUopiiYnNzYDaAbocoDK67w+9QJ5nSI1LbqulKEJ+TXyxdIzbdPcd6+8YC/7JIte7S0WEuOB9zy0BhQM8BoATVrgUkFgMmGnlqHoA+hO9gOQxXt3GonHGOA9nawVb+ALjUJGhoOb0rCT0xj8LlB0kZbXdLd8fcA5aGwG6Po0yiqr0xZ2sp7bALqZtLxZMPjCgfd0bgawCaDOKwR2dPsIQLeQlrc2F4Itf+A9nW0AugC0ZlZ2RsJWpx9mJpS0HujOB5+QT2b0dG4AcKgEm6e1Mhb08PUb8kGYO/CeTtaqt2ZX9oqArS6zlXZ/rCtXjLkBl2Gvz67sFQc7Wud62r00J+jZgZdgZ4Md1X+91N2eFXpm4CXYucKOrq+XDrVlhJ4eeE/nphLsvGDHzIt0qHVTOqzabmFP53IAe0qw84atLrNCWHJkb3bgPZ0uAN0J4yAl2PnCBh8SoLRNaD86rMarZVI2l2Drhs3SGcOU3mhiC5d7kYdKsHXDVn9fIrQfi/VGk1v4lmkBu2YNSN3nAdEx1WGzZYsacLyF8wsl3TOlYdtbQBq+DFg/IieHBkEvvAiMvj5VYUfXVwjtx/kF1BRnz8ezpyZswQ7S8Cjguh0JUlYPMvdZYPQN0IFfAMELUxE227ZBvpsUbeE9D7MbCKenJGznKrlVi3ZklIgHGPoj6ODWqQY7uj5PWHqiV7HhdM2Ug22dB9L0Q5DGr2eHzYTlqVsPsuAlwN461WBDueWotPCTD3Urw42TD1u0g7g/B1SvyQ45k1zeBXr+Z0BkbCrAZiuHhaUn2wg9sdEF0MtTAnbFTSCNT3CbbYhExkEHfwNc2jHZsKP5q0zyIwyTDLusTgZdvtgY0FERHSCzHwOct4Ke/wngPTmZsNmynNnwtkmDLZaDuB8EWbDVeNhqsS8BWbAdpHGT7Lur9Zo42Oxbm9LCJwG2fRHI7Cd4685Lhk4AAwflEg3tQM1Hcy9duxakchno+ReAkb0TDZu3cEJPfLGXj51MFGzmOzc8AlTcmB/o4Biw/ztA3/7E9KbbgNueBswV+e1v/CDomc1AsH8ihxv6GHA6UbCZ+UDN6sIuiv/8RirsqDDoq36U/z6ZVgO/5MsEwOZ/pgmBzcxH/Ze4b12QeAaAwYOA1aFdmm1jeewNee+d9WBJ9b2gfd8GHX+3qLDZf6aiwhbKQeofAVwrCwMdFd8loNyZPU8BwLmYZ4Es+DUwsgf03A+A4PmiwIY8llIk2FX3gtStM8anFkzZgQumzNtzEOJcAeL4OOjAi6CD2w2HrWrhMA4265LPerxw86El5XXZgZfn6e2kE+a7Nz4FUr0a9Nz3QcfeNgw2v47R9x+khsBmXfLadUD1PcYceLKc3QVcfEt7W91NwJy7ilItvbgd9MLPgcioITc/CH1/HdUN27kSpKGT2+yiyuAe4MODiTVUtwP1K4pbb2QM9OzzoEN/1gWb/RF6fB0tGHaZG2T240D5ouIesFqkIBAckhPMNYBgnri6x96GdO45wPtewXeaCD3+AM0bNuuSM9NR+8DEHewUEjYKycfdIyOJ3LLAVoCvpYkZssCuuB6k/uH8u+QzTVgP9cx3QYf/njNsxUvJA7a1GYR5HyOvplbiWjVzfwQGl9nvhGsX84yuBYJnAM+xnGAjxQ/PZrP9p0D9p1Tp8W3EvnjmAg/0g/b/tCCbnVxGyMsbSUjX2jaTRT9s9ieUYOcixsCWW7hRd9evBO46YcdMinHjwTNZ9MNmIhg7+D7DgeuErbRwlGDnIgbAjpkUw+50zGjRD5sxMxUTNj39NY2WodVSEP+eoqxWnTmka+0jZV+qdNXxkoW/Sz6S1P0WABvxhzl1wk530RzvNlRZTNDddaJ5MMboLxitbKqS0wt2+jPWGP0FY5XNoOi0gZ0BuAH6J3kp0xd2RKiDz3YHqODISX+f7U4ELW0a9WY4FAP0N02H0zCTLkFzC/y22zls0XcRwhkLxHA/UDUKk/V4QpmIWA9f+V3w2u8HiQCWwQMQz5oh1Ugos/9LpU+GY9Gpv2k6nIZaugQcd2PMdj+HaB46iqpj34d18ADPEbG54atYiZHaJ2Hx7IIV/fBaVsFnW8l/FMf/XoH99F9Awl6e32f/BIYaH4MJR+G8/L2iwUZ8eFYn7CKfhlq6mOvvg02qh23/t2AaP8vTQu7r4JlzJ3wNt4JIowiFIvCTG1Dh7IOl8lOwHOmC7fTf5D3ZKjB+1WfhnXUbItZa0MB5jEZWwonnMh2Mbv0zuIX5wC7uaailoyhEUFE5CxD8QKUbwws3wudYDIQvIeAbQTAs8PZkoyFewmavZn4qz+tvXIYRN7P3BKGgFwGPB5LEnk2MZDgWY/RP4xYWAltL0eLATjCDlW6+uBbcgXLTKMZ8FgW2Wg0lb7mL57XOW4naWU0YHQ/BFyyDJElJOhcHNlJMiqGwk7YXAzaT5pXAyHG+SggDJ6bRBUB9K2B3AqYyiGKafDmZx8L1N2XMkNejAOmkiLCZzF0NeFrkdVMte7knPcWGZYB0o/yoRSZ9NZOM0d+UNkO+z12kU74osJPqsyuP1YWDcDgcsFqtCAaDGB0dTVVJsMgLAIvFgqqqKng8HkQiEXi93txMow79BUNgF/k01HRdLU2p9QXHYbPZYDabY3ZZsM0DbAs1QZpMJm5aWH6/3w+TSLKfrTr1F1IyFAQ7XSsvEmwmgT75s3d3vDpLJYaHhzEwMAAp4uNAJd8pwHdcHpLqeRnwXoxl9/l86O/vh2d8mEMPR4oLGyleiqGwNcoUY2zk+G+B3V8BaBAQTTCbIjzZ64sgHA4nqvPhe8D+p4DhU5DCfljNciv3ByK8hSfqrHEsBugf91J0wS5+y9CEDcUtZELM3Af3+JK8D7Vq7JHnsJs9UQnBZIXXz8yOlD5/Qrox+pviO5uGsJm0fhW4sBs5ydxVQGiEu4WZdU6XplP/xLEUPbDTXTiLBVtVmX0u0HyfvG5uBDCQHljlAvkzX7fQCP1pgkkpBmz9p2HQ3Ipw2dWw+F+HGL6QWEZx7biYlJetvJfgdrtjnRp28QTR6OAojzgzF9LlcnGPhl1sZbcwPW69sKH0NPcBWKYPdibTkh9sNp7tt9wMT8V6UMkB27lXIfQ6EHbeALhHYRL/K5cQnSDc/qq68VKYwwsEAhgfH4fZLMJE6wGbGZD8gGBN0IzlZRfWoaEh7ofbbSJwOfU4qHpNB2zGmtlwNh3/sqkAO+Rai8vWL0Dwj8L+/isoP7ebD6Gy4dZgxRJ4Gu7hPUn3xXUgoUH+NC9eexqYfzcw63rA7sbQ4AcotxKUlZk5eD42bj4LVH0aeOcFoHoh0LQKYBdNrxfBYADmMoJIBPD4Mg1e6YbNll7Wwrv5hOuGw87/NDTbauCumwvxT/fy76HahfA0roKv/hZ5FDAURjDshFtdZ3AQOPYSB06on7t5Xj9zBwOpCjHr0vsKUHMNwo45vKfJfpQE7zH5opySXjBsttLNgO/VDzs99PxaBmT766rn6+Fbnkdw+ALvekuSJXGfUaldAATlqQFp6DLCYa3XB5X8bLQQc1glMJlk2LmJIbBZ+l6BLNrDWviIPtgGnoZMqpsAZz0fw7ZahKTh0yRpfRKYd3du3K55GLhmA2BO80ZzTJd06bpgj4gdke7oFWenLthGnYbRz/ZvAlevzh1KbXyiBEEQuPdRVlamnbf8KsDijn2trKzkeVk5JJjBdHUWBBtK1JTYWMpO/bB1tgx1eebyqSAyKBkhqoSN/jFXr6amRgNWorB9soW5kvF9Z5KCYceAc4NHFu/bSf9za188JMwkwGbbwhrDqQpw5r6FQiEI1MOzS6efAKm9T37BS4xP3cHsMhuWpYFzqA7ugivwB9CxcSBwFqR2LVB5cyyv2v+uCPwVbv+OHMxjQbD7xA4VcCVfF0CfKQQ2+5f+8bAcYbO1i12gw//g0yYRNkehAnJwcBA00I/qwHY4Qm/KZQLnQPt/DNr/ggK+k+eNDL+BquAuVAZ3JehPP/g9X1B+HcisR0FqH4DfcxEu/w7U+3dAoGM5mMeCYEMJUsIlNjMnPdLhUkJkOfOFzUSY/yvAsTRBR+lQS86wU5QVK0BqPwMPuQ7kUhds4cMqfdT543qGyuajLHRCte/0+kum2RDC2pPTiDdF379Utoy+BunoJwuFzXbWLHbQYSRP9kuP3MxmA34mX9hpwRUKW7PezLALPTML1j832EyeFTvisyxrTfbbV4JtGOw+mWlcEoCTljeHQXn0qRJs/bCZbIqakhhjrZAE9PAN7Iq6ugRbF+yXxQ6aMr1ouqAbG5QoeyXYhcHukxmmiiZw0npgWJ4AON7lL8HOGTZjtibZlEQlbVgZ0voOe19kTQl2XrChwE4bEC9j4CTS9u5eCrqxYGWvPNgbxQ6aEkomgWku4R2l7iXMvLDekrMEO60Z2RDtvmeSnONpSofa2vjYeUJPtARbgb08kxlRS87hHYUl3d1K5O59Jdgx2ad023MOYlpQiF7p4KJNSlCgNCYmm7LTHjZr1ZvFjsSQMblIfhFjFRHaj25R5h3fdgXC3saOvRDYMCLMunTw2mbe2ilNjEyoqey0hr1NadW6Qq0bE9eegf/3wmY5kgfdlDofOaYr7D4l0tROvaCjYhhwtUjvzo/CX66YnqZpAruPR1qk3BvbKXZIhkBWS1GAa4n0TnM89EEsDMKkw1Y6KRTiLaGMHRZDBMD/AYjm4xIUqEvMAAAADmVYSWZNTQAqAAAACAAAAAAAAADSU5MAAAAASUVORK5CYII=",
      to: "/pages/me/order/warehouse",
    },
    {
      title: "我的运单",
      src: "data:image/png;base64,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",
      to: "/pages/me/order/package",
    },
  ],
  setting: {
    index: [
      {
        title: "语言",
        path: "/setting/language",
      },
      {
        title: "货币",
        path: "/setting/currency",
      },
      {
        title: "修改密码",
        path: "/setting/changepwd",
      },
    ],
    language: [
      {
        title: "English",
        id: "en",
      },
      {
        title: "Français",
        id: "fr",
      },
      {
        title: "简体中文",
        id: "zh",
      },
    ],
    currency: [
      {
        title: "美元(0.15)",
      },
      {
        title: "人民币(1.00)",
      },
      {
        title: "欧元(0.14)",
      },
      {
        title: "加币(0.22)",
      },
    ],
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
      src: "https://bbdbuy.com/wap/static/img/xiaoxi.png",
      to: "/goods/favorite",
    },
    {
      title: "我的收藏",
      src: "https://bbdbuy.com/wap/static/img/xihuan.png",
      to: "/goods/favorite",
    },
    {
      title: "地址",
      src: "https://bbdbuy.com/wap/static/img/weizhi.png",
      to: "/pages/me/address/index",
    },
    {
      title: "历史记录",
      src: "https://bbdbuy.com/wap/static/img/zuji.png",
      to: "/pages/goods/goodsHistory",
    },
  ],
};
