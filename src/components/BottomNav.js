import React from "react";
import AccountCircleIcon from "@material-ui/icons//AccountCircle";
import KitchenIcon from "@material-ui/icons//Kitchen";
import MenuBookIcon from "@material-ui/icons//MenuBook";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Paper from "@mui/material/Paper";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { useSpeechRecognition } from "react-speech-recognition";
import { actionTypes } from "../reducer";
import { useStateValue } from "../StateProvider";
import { ThemeProvider } from "@mui/material";
import theme from "../function/theme";
const btnList = [
  {
    id: 0,
    title: "食譜",
    icon: <MenuBookIcon />,
    auth: "normal",
    routeTo: "/",
  },
  {
    id: 1,
    title: "冰箱管理",
    icon: <KitchenIcon />,
    auth: "normal",
    routeTo: "/fridge",
  },
  {
    id: 2,
    title: "個人",
    icon: <AccountCircleIcon />,
    auth: "normal",
    routeTo: "/profile",
  },
  {
    id: 3,
    title: "管理",
    icon: <ManageAccountsIcon />,
    auth: "admin",
    routeTo: "/recipe/admin/add",
  },
];

const user = { auth: "admin" };
const admin = "admin";

const BottomNav = () => {
  const [{ navbarBtnId }, dispatch] = useStateValue();
  let navigate = useNavigate();

  const commands = [
    {
      command: ["開啟冰箱", "打開冰箱", "冰箱(頁面)"],
      callback: () => {
        handleGlobalBtnIdState(1);
        navigate("/fridge");
      },
      // isFuzzyMatch: true, // 模糊匹配
      // fuzzyMatchingThreshold: 0.9, // 高於 80% 才確定
      // bestMatchOnly: true,
      matchInterim: true,
    },
    {
      command: ["開啟個人頁面", "(打開)個人頁面", "個人(頁面)"],
      callback: () => {
        handleGlobalBtnIdState(2);
        navigate("/profile");
      },
      matchInterim: true,
    },
    {
      command: ["回到首頁", "打開首頁", "(開啟)首頁", "(開啟)食譜"],
      callback: () => {
        handleGlobalBtnIdState(0);
        navigate("/");
      },
      isFuzzyMatch: true, // 模糊匹配
      fuzzyMatchingThreshold: 0.9, // 高於 80% 才確定
      bestMatchOnly: true,
      matchInterim: true,
    },
    {
      command: ["開啟管理頁面", "(打開)管理頁面", "管理(頁面)"],
      callback: () => {
        handleGlobalBtnIdState(3);
        navigate("/recipe/admin/add");
      },
      matchInterim: true,
    },
  ];

  useSpeechRecognition({ commands });

  const handleNavbarOnClick = (e, newValue) => {
    handleGlobalBtnIdState(newValue);
    navigate(btnList[newValue].routeTo);
  };

  const handleGlobalBtnIdState = (id) => {
    dispatch({
      type: actionTypes.SET_BOTTOMNAVBARID,
      navbarBtnId: id,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper
        className="bottomNav"
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, p: 1 }}
        elevation={5}
      >
        <BottomNavigation
          showLabels
          value={navbarBtnId}
          onChange={(e, newValue) => handleNavbarOnClick(e, newValue)}
        >
          {user.auth === admin
            ? btnList.map(({ id, title, icon }) => (
                <BottomNavigationAction
                  key={id}
                  label={title}
                  icon={icon}
                  style={
                    navbarBtnId === id
                      ? { color: "rgb(254, 139, 131)" }
                      : { color: "gray" }
                  }
                />
              ))
            : btnList
                .filter((btn) => btn.auth === user.auth)
                .map(({ id, title, icon }) => (
                  <BottomNavigationAction
                    key={id}
                    label={title}
                    icon={icon}
                    style={
                      navbarBtnId === id
                        ? { color: "rgb(254, 139, 131)" }
                        : { color: "gray" }
                    }
                  />
                ))}
        </BottomNavigation>
      </Paper>
    </ThemeProvider>
  );
};

export default BottomNav;
