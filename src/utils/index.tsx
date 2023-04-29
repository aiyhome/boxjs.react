import moment from "moment";
import React from "react";

export const ColorModeContext = React.createContext({
  toggleColorMode: (type: "dark" | "light" | "auto") => {
    console.log(type);
  },
});

export function getMediaMode() {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export const ROOT_PATH = `${process.env.ROOT_PATH}`;

export const getCommentTime = (str: string) => {
  const date = new Date(str);
  const createTime = moment(date).unix();
  const serverTime = moment().unix();
  const interval = serverTime - createTime;
  if (!interval && interval !== 0) return "未知";
  if (interval < 60) {
    return "刚刚";
  } else if (interval < 60 * 60) {
    let tempTime = Math.floor(interval / 60);
    return `${tempTime}分钟前`;
  } else if (interval < 60 * 60 * 24) {
    let tempTime = Math.floor(interval / (60 * 60));
    return `${tempTime}小时前`;
  } else if (interval < 60 * 60 * 24 * 7) {
    let tempTime = Math.floor(interval / (60 * 60 * 24));
    return `${tempTime}天前`;
  } else if (interval < 60 * 60 * 24 * 365) {
    return moment(createTime - 0).format("MM-DD");
  } else {
    return moment(createTime - 0).format("YYYY-MM-DD");
  }
};
