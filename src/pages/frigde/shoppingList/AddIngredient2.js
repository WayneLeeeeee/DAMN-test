import React, { useState } from "react";
//mui
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useStateValue } from "../../../StateProvider";
import styled from "@emotion/styled";
import {
  Autocomplete,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import CustomIcon from "../../../components/Icon";
import useSearch from "../../../hooks/useSearch";
import { db, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { actionTypes } from "../../../reducer";

function AddIngredient2() {
  //global state
  const [{ ingredient, isUpdated }, dispatch] = useStateValue();

  // autocomplete 搜尋
  const [searchTerm, setSearchTerm] = useState("");
  const onSearchChange = (e) => setSearchTerm(e.target.value);
  const ingredientsData = useSearch("ingredients", searchTerm);

  //change 用
  const [name, setName] = useState("");
 
  
  const ThumbnailInput = styled("input")({
    display: "none",
  });

  //使用者id
  const user = localStorage.getItem("userUid");

  //跳轉畫面
  const navigate = useNavigate();
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


  //圖片
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

  const handleChangeName = (value) => {
    setName(value);
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, name: value },
    });
  };

  const handleChangeCategory = (value) => {
    setName(value);
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, category: value },
    });
  };

  const handleChangeQuantity = (e) => {
    setName(e.target.value);
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, quantity: e.target.value },
    });
  };

  const handleChangeUnit = (e) => {
    setName(e.target.value);
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, unit: e.target.value },
    });
  };

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

  //新增
  const handleSubmittoS = async () => {
    const result = {
      ...ingredient,
      imageURL: await getRemoteThumbnailURL(),
    };

    console.log(result);

    // 傳送至 fireStore
    const docRef = await addDoc(
      collection(db, "users", `${user}`, "shoppingList"),
      result
    );
    console.log("Document written with ID: ", docRef.id);
    // need to clear global state
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: {},
    });
    // navigate to homepage page
    navigate("/fridge");
  };

  //修改
  const handleModifytoF = async () => {
    const result = {
      ...ingredient,
      // imageURL: await getRemoteThumbnailURL(),
    };

    console.log(result);

    // 傳送至 fireStore
    const washingtonRef = doc(
      db,
      "users",
      `${user}`,
      "shoppingList",
      ingredient?.id
    );
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

  console.log("這裡", ingredient);

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
          options={ingredientsData}
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
          <Button size="large" onClick={handleSubmittoS}>
            放入購物車
          </Button>
        </div>
      )}
    </div>
  );
}

export default AddIngredient2;
