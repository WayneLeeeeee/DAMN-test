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
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { db, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { actionTypes } from "../../../reducer";

function AddIngredient2() {
  const [{ ingredient, isUpdated }, dispatch] = useStateValue();
  const [searchTerm, setSearchTerm] = useState("");
  const ingredientsData = useSearch("ingredients", searchTerm);
  const ingredientsData2 = useSearch("ingredients", searchTerm);
  const [name, setName] = useState("");
  // const [namae, setNamae] = useState(ingredient.name);
  const onSearchChange = (e) => setSearchTerm(e.target.value);
  const [value, setValue] = React.useState(null);
  const ThumbnailInput = styled("input")({
    display: "none",
  });
  const user = localStorage.getItem("userUid");
  const navigate = useNavigate();

  function navigatetoFridge() {
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: {
        name: "",
        category: "",
        quantity: 0,
        unit: "",
        notes: "",
        endDate: undefined,
        isFrozen: false,
        imageURL: "",
      },
    });
    dispatch({
      type: actionTypes.SET_ISUPDATED,
      isUpdated: false,
    });
    navigate(`/fridge`);
  }

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

  const handleChangeisFrozen = (e) => {};

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

  const handleSubmittoS = async () => {
    const result = {
      ...ingredient,
      imageURL: await getRemoteThumbnailURL(),
    };
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: {
        name: "",
        category: "",
        quantity: 0,
        unit: "",
        notes: "",
        endDate: undefined,
        isFrozen: false,
        imageURL: "",
      },
    });

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

  const handleModifytoF = async () => {
    const result = {
      ...ingredient,
      imageURL: await getRemoteThumbnailURL(),
    };
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: {
        name: "",
        category: "",
        quantity: 0,
        unit: "",
        notes: "",
        endDate: undefined,
        isFrozen: false,
        imageURL: "",
      },
    });

    console.log(result);

    // 傳送至 fireStore
    const washingtonRef = doc(
      db,
      "users",
      `${user}`,
      "shoppingList",
      ingredient?.id
    );
    await updateDoc(washingtonRef, {
      name: result.name,
      category: result.category,
      quantity: result.quantity,
      unit: result.unit,
      notes: result.notes,
      // endDate: result.endDate,
      isFrozen: result.isFrozen,
      imageURL: result.imageURL,
    });
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
          sx={{ width: 300, marginTop: "20px" }}
          onChange={(__, value) => handleChangeCategory(value.category)}
          onInputChange={onSearchChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label={isUpdated ? ingredient.category : "類別"}
            />
          )}
        />
        <OutlinedInput
          sx={{ width: 300, marginTop: "20px" }}
          type="number"
          id="outlined-adornment-amount"
          value={ingredient.quantity}
          onChange={handleChangeQuantity}
          label="數量"
          endAdornment={<InputAdornment position="start"></InputAdornment>}
        />
        <TextField
          sx={{ width: 300, marginTop: "20px" }}
          id="unit"
          label="單位"
          variant="outlined"
          maxRows={4}
          required
          margin="dense"
          onChange={handleChangeUnit}
          value={ingredient.unit}
        />
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="有效期限"
            value={
              isUpdated
                ? moment(ingredient.endDate.seconds * 1000).format("YYYY/MM/DD")
                : value
            }
            onChange={(newValue) => {
              setValue(newValue);
              dispatch({
                type: actionTypes.SET_INGREDIENT,
                ingredient: { ...ingredient, endDate: newValue },
              });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider> */}
        <TextField
          sx={{ width: 300, marginTop: "20px" }}
          id="unit"
          label="是否冷凍"
          variant="outlined"
          maxRows={4}
          margin="dense"
          //   onChange={handleChangeisFrozen}
          value={ingredient.isFrozen}
        />
        <TextField
          sx={{ width: 300, marginTop: "20px" }}
          id="unit"
          multiline
          label="備註"
          variant="outlined"
          maxRows={4}
          margin="dense"
          onChange={handleChangeNotes}
          value={ingredient.notes}
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
