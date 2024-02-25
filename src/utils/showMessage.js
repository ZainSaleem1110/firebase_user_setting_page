import { notification } from "antd";

notification.config({
  duration: 3,
  maxCount: 1,
});

export const showMessage = (message, isError = false) => {
  if (isError) {
    return notification.error({
      message: `Error`,
      description: message,
      placement: "topRight",
    });
  } else {
    return notification.success({
      message: `Success`,
      description: message,
      placement: "topRight",
    });
  }
};