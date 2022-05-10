import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import Ticker from "react-ticker";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import algolia from "../../algolia";
import { Search } from "semantic-ui-react";
import useSearch from "../../hooks/useSearch";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import sendNotice from "../../function/sendNotice";
import {
  collection,
  where,
  getDocs,
  query as firebaseQuery,
} from "firebase/firestore";
import { db } from "../../firebase";

function IndexTop() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userUid");
  const [inputValue, setInputValue] = useState("");
  const [recipeResults, setRecipeResults] = useState([]);
  const [query, setQuery] = useState("");
  const results = useSearch("recipes", query);
  console.log(results);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("query");
  console.log(q);

  const [isNoticeDialogOpen, setIsNoticeDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [scroll, setScroll] = useState("paper");

  const handleClickOpen = (scrollType) => () => {
    setIsNoticeDialogOpen(true);
    setScroll(scrollType);
    fetchNotifications();
  };

  const handleClose = () => {
    setIsNoticeDialogOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  useEffect(() => {
    if (isNoticeDialogOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isNoticeDialogOpen]);

  function onSearchChange(e, { value }) {
    setInputValue(value);

    algolia.search(value).then((result) => {
      const searchResults = result.hits.map((hit) => {
        return {
          title: hit.name,
          // description:hit.category,
          id: hit.objectID,
        };
      });
      // setResults(searchResults);
    });
  }

  function onResultSelect() {
    console.log(query);
    setSearchParams(query);
    navigate(`/recipe/search/?query=${query}`);
  }

  useEffect(() => {
    const newResults = results.map((item) => ({
      title: item.name,
      id: item.objectID,
    }));

    setRecipeResults(newResults);
  }, [results]);

  console.log("recipeResults: ", recipeResults);

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const fetchNotifications = async () => {
    console.log(userId);
    const q = firebaseQuery(
      collection(db, "users", `${userId}`, "notifications"),
      where("isChecked", "==", false)
    );

    const querySnapshot = await getDocs(q);
    let temp = [];
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      temp.push({ id: doc.id, ...doc.data() });
    });
    console.log("temp: ", temp);
    setNotifications(temp);
  };

  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  return (
    <div className="recipeIndexTop">
      <div className="recipeIndexTop__slogan">
        <VolumeUpIcon />

        <Ticker mode="smooth">
          {() => (
            <>
              <h4>開啟智能語音讓你更快速解決問題 </h4>
            </>
          )}
        </Ticker>
      </div>

      <div className="recipeIndexTop__title">
        <h4>你今天想要煮什麼？</h4>
        <Button onClick={handleClickOpen("paper")}>
          <NotificationsIcon />
        </Button>
      </div>
      <div className="recipeIndexTop__search">
        <Search
          placeholder="搜尋食譜"
          value={query}
          onSearchChange={(e) => setQuery(e.target.value)}
          results={recipeResults}
          noResultsMessage="找不到相關食譜"
          // onResultSelect={}
        />
        <SearchIcon onClick={onResultSelect} />
      </div>

      <Dialog
        open={isNoticeDialogOpen}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">通知</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <Stack sx={{}} spacing={2}>
            {notifications.map((notification, index) => (
              <Alert
                severity={notification?.type}
                key={notification.id}
                onClose={() => {
                  console.log("delete");
                }}
              >
                <h3>{notification?.title}</h3>
                <p> {notification?.message}</p>
              </Alert>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              sendNotice({ type: "error", title: "hello", message: "幹" })
            }
          >
            send notice
          </Button>
          <Button onClick={handleClose}>關閉</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default IndexTop;
