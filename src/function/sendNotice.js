import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { Store } from "react-notifications-component";
import { Timestamp } from "firebase/firestore";
const sendNotice = async (data) => {
  /*
    data={
        type: string ("warning" | "error" | "info" | "success")
        title: string
        message: string (要傳送的字串)
    }

    */
  console.log(`send message ${data.message}`);
  let { type, message, title } = data;
  let reactNotificationsType = type;
  if (!message) return console.error("param: (message) lost");
  if (type === "error") reactNotificationsType = "danger"; // react-notifications-component 與 MUI 的 危險標示 不一樣 error === danger
  const userId = localStorage.getItem("userUid");
  const temp = {
    type: type,
    title: title,
    message: message,
    isChecked: false,
    createdAt: Timestamp.now().toDate(),
  };

  // 將通知傳送到資料庫 notifications
  await addDoc(collection(db, "users", `${userId}`, "notifications"), temp);

  // 顯示五秒的通知
  Store.addNotification({
    title: title,
    message: message,
    type: reactNotificationsType,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 3000,
      onScreen: true,
    },
  });
};

export default sendNotice;
