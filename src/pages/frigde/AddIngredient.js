import React, { useState, useEffect } from "react";
//mui
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useStateValue } from "../../StateProvider";
import styled from "@emotion/styled";
import {
  Autocomplete,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import CustomIcon from "../../components/Icon";
import useSearch from "../../hooks/useSearch";
import { actionTypes } from "../../reducer";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { db, storage } from "../../firebase";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import moment from "moment";
import { MobileDatePicker } from "@mui/lab";
import algoliaSearch from "../../function/algoliaSearch";
import speak from "../../function/speak";
import useRecognize from "../../hooks/useRecognize";

function AddIngredient() {
  //global state
  const [{ ingredient, isUpdated, textFromMic }, dispatch] = useStateValue();

  //autocomplete 搜尋
  const [searchTerm, setSearchTerm] = useState("");
  const onSearchChange = (e) => setSearchTerm(e.target.value);
  const ingredientsData = useSearch("ingredients", searchTerm);
  const ingredientsData2 = useSearch("ingredients", searchTerm);

  //Change用
  const [name, setName] = useState("");

  const [value, setValue] = React.useState(null);

  const ThumbnailInput = styled("input")({
    display: "none",
  });

  //使用者id
  const user = localStorage.getItem("userUid");

  //跳轉化面
  const navigate = useNavigate();
  let STT_Commands = [
    {
      intent: "Fridge.Add",
      callback: (entities) => {
        STT_add_Ingredient(entities);
      },
    },
  ];
  const [intentInfo, topIntent, clearIntent] = useRecognize(
    textFromMic,
    STT_Commands
  );
  console.log("意圖: ", intentInfo);
  // 新增食材語音
  const STT_add_Ingredient = async (entities) => {
    const food = entities?.$instance.Foods[0].text;
    // 透過 聽到的食材 搜尋 歷史紀錄（historyIngredients）
    const users = await algoliaSearch("historyIngredients", food, user);
    if (!food || !user || !entities) {
      // 如果沒有結果，代表使用者從沒手動新增過這項食材，就說「請先手動新增一次，之後就可以透過語音新增喔」
      speak("聽不懂欲加入的食材，請先手動新增一次，之後就可以透過語音新增喔");
      return;
    }
    if (users) {
      // 如果有，返回 第一個最新的物件（所有欄位自動帶入）
      const historyList = users[0].historyIngredients;
      const historyItem = historyList.filter((e) => e.name === food)[0];
      const duration = historyItem?.duration;
      delete historyItem.objectID; // 清除 objectID
      historyItem.endDate = new Date(moment().add(duration, "days").format()); // 將 endDate （截止日期） 改成 現在日期 + duration

      console.log("historyItem: ", historyItem);
      const docRef = await addDoc(
        collection(db, "users", `${user}`, "fridge"),
        historyItem
      );

      // 新增成功說 “已新增「食材名稱」進冰箱！”
      speak(`已幫您新增${food}至冰箱！`);
      // 跳轉冰箱頁面檢視
      // navigate("fridgePage");
      return;
    }

    // 註：歷史紀錄（historyIngredients）透過  ”名稱“ 來辨識是否新增至 collection
  };

  // useEffect(() => {
  //   STT_add_Ingredient();
  // }, []);

  function navigatetoFridge() {
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: {},
    });
    dispatch({
      type: actionTypes.SET_ISUPDATED,
      isUpdated: false,
    });
    navigate(`/fridge`);
  }

  //顯示圖片
  const handleRecipeThumbnail = (e) => {
    const thumbnail = {
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    };
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, imageURL: thumbnail },
    });
  };

  //改名稱
  const handleChangeName = (value) => {
    setName(value);
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, name: value },
    });
  };

  //改類別
  const handleChangeCategory = (value) => {
    setName(value);
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, category: value },
    });
  };

  //改數量
  const handleChangeQuantity = (e) => {
    setName(e.target.value);
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, quantity: e.target.value },
    });
  };

  //改單位
  const handleChangeUnit = (e) => {
    setName(e.target.value);
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, unit: e.target.value },
    });
  };

  //改備註
  const handleChangeNotes = (e) => {
    setName(e.target.value);
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, notes: e.target.value },
    });
  };

  const getSingleRemoteURL = async (file) => {
    if (!file) return;
    const recipesRef = ref(storage, `food/${uuidv4()}.jpg`);
    const metadata = { ...file };
    console.log(metadata);
    await uploadBytes(recipesRef, file, metadata)
      .then((snapshot) => {
        console.log("Uploaded success");
      })
      .catch((error) => {});

    return await getDownloadURL(recipesRef);
  };

  // 取得縮圖的遠端網址
  const getRemoteThumbnailURL = async () => {
    const temp = {
      url: await getSingleRemoteURL(ingredient?.imageURL?.file),
    };
    return temp;
  };

  //新增 食材至冰箱 F => Fridge
  const handleSubmittoF = async () => {
    let result = {
      ...ingredient,
      imageURL: await getRemoteThumbnailURL(),
    };
    // 註：歷史紀錄（historyIngredients），需要 duration (天數 = 有效期限 - 當天日期 )，用來預測之後語音輸入的有效期限
    result.duration = moment(result.endDate)
      .fromNow()
      .replace(/[^0-9]/g, "");
    console.log("result: ", result);

    // 傳送至 fireStore
    const docRef = await addDoc(
      collection(db, "users", `${user}`, "fridge"),
      result
    );

    // 傳送至 firestore collection 歷史紀錄（historyIngredients）
    sendDataToHistoryIngredients(result);

    // need to clear global state
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: {},
    });
    // navigate to homepage page
    navigate("/fridge");
  };

  // 傳送至 firestore collection 歷史紀錄（historyIngredients）
  const sendDataToHistoryIngredients = async (data) => {
    const getAllHistoryIngredients = async () => {
      const q = query(
        collection(db, "users", `${user}`, "historyIngredients"),
        where("name", "==", data.name)
      );
      let tempList = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        tempList.push({ id: doc.id, ...doc.data() });
      });
      return tempList;
    };
    let id = "";
    const allHistoryIngredientsList = await getAllHistoryIngredients();
    //查看 historyIngredients 有沒有同樣名稱的 Item
    const haveSameNameList = allHistoryIngredientsList.filter(
      (item) => item.name === data.name
    );

    if (haveSameNameList.length > 0) {
      // 有，就更新資料
      id = haveSameNameList[0].id;
      await setDoc(
        doc(db, "users", `${user}`, "historyIngredients", id),
        data,
        {
          merge: true,
        }
      );
      return;
    }
    // 沒有，就創造資料
    await addDoc(
      collection(db, "users", `${user}`, "historyIngredients"),
      data
    );
  };

  //修改
  const handleModifytoF = async () => {
    const result = {
      ...ingredient,
      // imageURL: await getRemoteThumbnailURL(),
    };

    console.log(result);

    // 傳送至 fireStore
    const washingtonRef = doc(db, "users", `${user}`, "fridge", ingredient?.id);
    await setDoc(washingtonRef, result);
    // need to clear global state
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: {},
    });
    dispatch({
      type: actionTypes.SET_ISUPDATED,
      isUpdated: false,
    });
    // navigate to homepage page
    navigate("/fridge");
  };

  return (
    <div className="AddIngredient">
      <div className="AddIngredient__bar">
        <ArrowBackIosIcon onClick={navigatetoFridge} />
        <h4>{ingredient.name}</h4>
        <h5>{ingredient.category}</h5>
      </div>
      <div className="div">
        <label htmlFor="icon-button-file">
          <div className="AddIngredientImg">
            <img src={ingredient.imageURL?.url} alt="" loading="lazy" />
            <ThumbnailInput
              accept="image/*"
              id="icon-button-file"
              type="file"
              name="imageURL"
              onChange={handleRecipeThumbnail}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              style={{
                display: `${ingredient.imageURL ? "none" : "unset"}`,
              }}
            >
              <CustomIcon
                size={80}
                name="AddPhotoAlternateIcon"
                hidden={ingredient.imageURL ? true : false}
                color="#C7E3EE"
              />
            </IconButton>
          </div>
        </label>
        {/* 食材名稱 搜尋 */}
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={ingredientsData}
          noOptionsText="沒有ㄝ~試試其他關鍵字吧！"
          getOptionLabel={(option) => option.name}
          sx={{ width: 300 }}
          onChange={(__, value) => handleChangeName(value.name)}
          onInputChange={onSearchChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label={isUpdated ? ingredient.name : "名稱"}
            />
          )}
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={ingredientsData2}
          noOptionsText="沒有ㄝ~試試其他關鍵字吧！"
          getOptionLabel={(option) => option.category}
          sx={{ width: 300 }}
          onChange={(__, value) => handleChangeCategory(value.category)}
          onInputChange={onSearchChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label={isUpdated ? ingredient.category : "類別"}
            />
          )}
        />
        <TextField
          id="outlined-number"
          label="數量"
          type="number"
          value={ingredient.quantity}
          onChange={handleChangeQuantity}
          sx={{ width: 300, marginTop: "20px", paddingLeft: "10px" }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          id="outlined-number"
          label="單位"
          type="text"
          value={ingredient.unit}
          onChange={handleChangeUnit}
          sx={{ width: 300, marginTop: "20px", paddingLeft: "10px" }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDatePicker
            label="有效日期"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
              dispatch({
                type: actionTypes.SET_INGREDIENT,
                ingredient: { ...ingredient, endDate: newValue },
              });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <TextField
          id="outlined-number"
          label="是否冷凍"
          type="text"
          value={ingredient.isFrozen}
          // onChange={handleChangeIsFrozen}
          sx={{ width: 300, marginTop: "20px", paddingLeft: "10px" }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="outlined-number"
          label="備註"
          type="text"
          multiline
          value={ingredient.notes}
          onChange={handleChangeNotes}
          sx={{ width: 300, marginTop: "20px", paddingLeft: "10px" }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      {isUpdated ? (
        <div className="AddIngredient__submit">
          <Button size="large" onClick={handleModifytoF}>
            完成修改放入冰箱
          </Button>
        </div>
      ) : (
        <div className="AddIngredient__submit">
          <Button size="large" onClick={handleSubmittoF}>
            放入冰箱
          </Button>
        </div>
      )}
    </div>
  );
}

export default AddIngredient;
