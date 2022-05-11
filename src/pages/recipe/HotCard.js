import React, { useEffect, useState } from "react";
// import stake from "../../images/stake.jpg";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  setDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../../firebase";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FlatwareIcon from "@mui/icons-material/Flatware";

function HotCard({ data }) {
  const userUid = localStorage.getItem("userUid");
  const recipesLikes = doc(db, "recipes", data.id);
  const [isLiked, setIsLiked] = useState([]);
  const [dataLikes, setDataLikes] = useState(data.likes);

  const handleLike = async () => {
    const docRef = doc(
      db,
      "users",
      `${userUid}`,
      "isLikedrecipes",
      `${data.id}`
    );
    const docSnap = await getDoc(docRef);
    //不存在代表沒案過讚
    if (!docSnap.exists()) {
      await updateDoc(recipesLikes, {
        likes: dataLikes + 1,
      });
      await setDoc(
        doc(db, "users", `${userUid}`, "isLikedrecipes", `${data.id}`),
        {
          recipe: `${data.name}`,
          image: `${data.thumbnail.url}`,
        }
      );
      setDataLikes(dataLikes + 1);
    } else {
      await updateDoc(recipesLikes, {
        likes: dataLikes - 1,
      });
      await deleteDoc(
        doc(db, "users", `${userUid}`, "isLikedrecipes", `${data.id}`)
      );
      setDataLikes(dataLikes - 1);
    }
  };

  useEffect(() => {
    async function readData() {
      const querySnapshot = await getDocs(
        collection(db, "users", `${userUid}`, "isLikedrecipes")
      );
      const temp = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        temp.push(doc.id);
      });
      console.log(temp);
      setIsLiked(...[temp]);
    }

    readData();
  }, [dataLikes]);

  //跳轉
  let navigate = useNavigate();
  const handleRouteToItemPage = () => {
    console.log(data);
    navigate(`/recipe/${data.id}`);
  };

  return (
    <div className="hotCard">
      <img
        className="hotCard__img"
        style={{
          maxWidth: "unset",
        }}
        src={data.thumbnail.url}
        alt=""
        onClick={handleRouteToItemPage}
      />
      <div>
        <div className="hotCard__content">
          <div className="hotCard__title">
            {/* <h3>{data.name}</h3> */}
            <div className="hotCard__title-2">
              <h3>{data.name}</h3>
              {/* <h4>{dataLikes}說讚</h4> */}
            </div>
          </div>
          <span></span>
          <div className="hotCard__items">
            <div className="hotCard__item">
              {isLiked.indexOf(data.id) > -1 ? (
                <FavoriteIcon
                  sx={{
                    color: "#FE8B83",
                    paddingRight: "5px",
                    cursor: "pointer",
                  }}
                  onClick={handleLike}
                  link
                />
              ) : (
                <FavoriteBorderIcon
                  sx={{
                    color: "#FE8B83",
                    paddingRight: "5px",
                    cursor: "pointer",
                  }}
                  onClick={handleLike}
                />
              )}
              {/* {isLiked.indexOf(data.id) > -1 ? <h4>已說讚</h4> : <h4>讚</h4>} */}
              {dataLikes}
              {/* <h4>{dataLikes}</h4> */}
            </div>
            <div className="hotCard__item">
              <FlatwareIcon sx={{ color: "gray", paddingRight: "5px" }} />
              <h4>{data.serving}</h4>
              <h5>人</h5>
            </div>
            <div className="hotCard__item">
              <StarIcon sx={{ color: "gold", paddingRight: "5px" }} />
              <h4>{data.rating}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotCard;
