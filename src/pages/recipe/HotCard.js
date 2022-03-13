import React, { useEffect, useState } from "react";
// import stake from "../../images/stake.jpg";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  setDoc,
  getDocs,
  collection,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

function HotCard({ data }) {
  const userUid = localStorage.getItem("userUid");
  const recipesLikes = doc(db, "recipes", data.id);
  const isLikedindb = doc(db, "users", userUid, "isLikedrecipes", data.id);
  const [isLiked, setIsLiked] = useState();
  const [isLikedId, setIsLikedId] = useState();
  const [dataLikes, setDataLikes] = useState(data.likes);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = async (id) => {
    setOpen(true);
    const docRef = doc(
      db,
      "users",
      `${userUid}`,
      "isLikedrecipes",
      `${data.id}`
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const docSnap = await getDoc(docRef);
      setIsLiked(docSnap.data().isLiked);
      setIsLikedId(docSnap.id);
    } else {
      console.log("No such document!");
    }
   
  };

  console.log(isLiked);
  console.log(isLikedId);

  //跳轉
  let navigate = useNavigate();
  const handleRouteToItemPage = () => {
    console.log(data);
    navigate(`/recipe/${data.id}`);
  };

  const likeClick = async () => {
    setOpen(false);
    if (data.id === isLikedId) {
      await updateDoc(recipesLikes, {
        likes: data.likes + 1,
      });
      setDataLikes(data.likes + 1);
      await updateDoc(isLikedindb, {
        isLiked: true,
      });
    } else {
      await setDoc(
        doc(db, "users", `${userUid}`, "isLikedrecipes", `${data.id}`),
        {
          recipe: `${data.name}`,
          isLiked: true,
        }
      );
      await updateDoc(recipesLikes, {
        likes: data.likes + 1,
      });
      setDataLikes(data.likes + 1);
      await updateDoc(isLikedindb, {
        isLiked: true,
      });
    }
  };

  const disLikeClick = async () => {
    setOpen(false);
    if (data.id === isLikedId) {
      await updateDoc(recipesLikes, {
        likes: dataLikes - 1,
      });
      setDataLikes(dataLikes - 1);
      await updateDoc(isLikedindb, {
        isLiked: false,
      });
    }
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
      <Card>
        <CardContent elevation={3}>
          <Typography variant="h5" component="div">
            {data.name}
          </Typography>
          <Typography variant="h5" component="div">
            {data.author}
          </Typography>
          <span></span>
          <div className="hotCard__item">
            <Typography>
              <ThumbUpIcon
                sx={{ color: "#2D8DFF", paddingRight: "5px" }}
                onClick={handleClickOpen}
              />
              {dataLikes}
            </Typography>
            <Typography>
              <AccessTimeIcon sx={{ color: "#45BCFF", paddingRight: "5px" }} />
              {data.cookTime}
            </Typography>
            <Typography>
              <StarIcon sx={{ color: "#FE645A", paddingRight: "5px" }} />
              {data.rating}
            </Typography>
          </div>
        </CardContent>
      </Card>

      {isLiked === true ? (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"你不收藏了嗎！"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              敢移除我就...我就..嘔不要鬧了啦
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={disLikeClick}>狠心移除</Button>
            <Button onClick={handleClose}>手下留情</Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"趕快收藏吧！"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              這麼好的食譜，一定要收藏的吧！
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>狠心拒絕</Button>
            <Button onClick={likeClick}>手刀收藏</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default HotCard;
