import React, { useState } from "react";

//components
import TopBar from "../../../components/fridge/CreateShoppinglistBar";
import CustomIcon from "../../../components/Icon";

//firebase
import { db, storage } from "../../../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

//mui
import {
  Autocomplete,
  Button,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

//跳轉頁面
import { useNavigate } from "react-router-dom";
import useSearch from "../../../hooks/useSearch";
import Checkbox from "@mui/material/Checkbox";
import { useStateValue } from "../../../StateProvider";
import { actionTypes } from "../../../reducer";

function CreateShoppinglist(props) {
  const navigate = useNavigate();
  const ThumbnailInput = styled("input")({
    display: "none",
  });
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const user = localStorage.getItem("userUid");
  const [value, setValue] = React.useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const ingredientsData = useSearch("ingredients", searchTerm);
  const onSearchChange = (e) => setSearchTerm(e.target.value);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [{ ingredient, isUpdated, isUpdated2 }, dispatch] = useStateValue();

  //購物清單結構
  const [name, setName] = useState("");

  //set shoppingList
  const handleChangeName = function (value) {
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, name: value },
    });
  };
  const handleChangeQuantity = function (e) {
    setName(e.target.value);
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, quantity: e.target.value },
    });
  };
  const handleChangeUnit = function (e) {
    setName(e.target.value);
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, unit: e.target.value },
    });
  };
  const handleChangeNotes = function (e) {
    setName(e.target.value);
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: { ...ingredient, notes: e.target.value },
    });
  };
  // const handleChangeisFrozen = function (e) {
  //   if (shoppingList.isFrozen === false) {
  //     setShoppingList({ ...shoppingList, isFrozen: true });
  //   } else {
  //     setShoppingList({ ...shoppingList, isFrozen: false });
  //   }
  // };
  // const handleChange = function (e) {
  //   setShoppingList({ ...shoppingList, [e.target.name]: e.target.value });
  // };
  //縮圖
  const handleThumbnail = (e) => {
    const thumbnail = {
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    };
    // setShoppingList({
    //   ...shoppingList,
    //   imageURL: thumbnail.url,
    //   imageFile: thumbnail.file,
    // });
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: {
        ...ingredient,
        imageURL: thumbnail.url,
        imageFile: thumbnail.file,
      },
    });
  };

  //uplode image
  const upload = async function (file) {
    const imageRef = ref(storage, `food/${file}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    return url;
  };

  //add to firebase
  async function addDatatoShoppingList() {
    const imgurl = await upload(ingredient.imageFile);
    const docRef = await addDoc(
      collection(db, "users", `${user}`, "shoppingList"),
      {
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        notes: ingredient.notes,
        endDate: ingredient.endDate,
        isFrozen: ingredient.isFrozen,
        imageURL: imgurl,
      }
    );
    dispatch({
      type: actionTypes.SET_ISUPDATED,
      isUpdated: false,
    });
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: {
        ingredient: {
          name: "",
          quantity: 0,
          unit: "",
          notes: "",
          endDate: undefined,
          isFrozen: false,
          imageURL: "",
        },
      },
    });
    navigate("/fridge/shoppinglist");
  }

  async function addDatatofridge() {
    const imgurl = await upload(ingredient.imageFile);
    const docRef = await addDoc(collection(db, "users", `${user}`, "fridge"), {
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      notes: ingredient.notes,
      endDate: ingredient.endDate,
      isFrozen: ingredient.isFrozen,
      imageURL: imgurl,
    });
    dispatch({
      type: actionTypes.SET_ISUPDATED,
      isUpdated: false,
    });
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: {
        ingredient: {
          name: "",
          quantity: 0,
          unit: "",
          notes: "",
          endDate: undefined,
          isFrozen: false,
          imageURL: "",
        },
      },
    });
    navigate("/fridge/fridgemanage");
  }

  async function modifyData2() {
    const imgurl = await upload(ingredient.imageFile);
    const docRef = await updateDoc(
      doc(db, "users", `${user}`, "shoppingList", ingredient.id),
      {
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        notes: ingredient.notes,
        endDate: ingredient.endDate,
        isFrozen: ingredient.isFrozen,
        imageURL: imgurl,
      }
    );
    dispatch({
      type: actionTypes.SET_ISUPDATED,
      isUpdated: false,
    });
    dispatch({
      type: actionTypes.SET_ISUPDATED2,
      isUpdated2: false,
    });
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: {
        ingredient: {
          name: "",
          quantity: 0,
          unit: "",
          notes: "",
          endDate: undefined,
          isFrozen: false,
          imageURL: "",
        },
      },
    });
    navigate("/fridge/shoppingList");
  }

  async function modifyDatatofridge() {
    const imgurl = await upload(ingredient.imageFile);
    const docRef = await updateDoc(
      doc(db, "users", `${user}`, "fridge", ingredient.id),
      {
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        notes: ingredient.notes,
        endDate: ingredient.endDate,
        isFrozen: ingredient.isFrozen,
        imageURL: imgurl,
      }
    );
    dispatch({
      type: actionTypes.SET_ISUPDATED,
      isUpdated: false,
    });
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: {
        ingredient: {
          name: "",
          quantity: 0,
          unit: "",
          notes: "",
          endDate: undefined,
          isFrozen: false,
          imageURL: "",
        },
      },
    });

    navigate("/fridge/fridgemanage");
  }

  console.log(ingredient);

  return (
    <div className="CreateShoppinglist">
      <TopBar />
      <label htmlFor="icon-button-file">
        <div className="CreateShoppingListImg">
          <img
            src={isUpdated ? ingredient?.imageURL : ingredient?.imageURL}
            alt=""
            loading="lazy"
          />
          <ThumbnailInput
            accept="image/*"
            id="icon-button-file"
            type="file"
            name="imageURL"
            onChange={handleThumbnail}
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
      <div className="div">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={ingredientsData}
          noOptionsText="沒有ㄝ~試試其他關鍵字吧！"
          getOptionLabel={(option) => option.name}
          sx={{ width: 300, marginTop: "20px" }}
          onChange={(__, value) => handleChangeName(value.name)}
          onInputChange={onSearchChange}
          renderInput={(params) => <TextField {...params} label="名稱" />}
        />
        <div className="CreateShoppingListQuantity">
          <h5>數量</h5>
          <Input
            type="number"
            name="quantity"
            value={isUpdated ? ingredient?.quantity : ingredient?.quantity}
            onChange={handleChangeQuantity}
          />
        </div>
        <div className="CreateShoppingListQuantity">
          <h5>單位</h5>
          <Input
            type="text"
            name="unit"
            value={isUpdated ? ingredient?.unit : ingredient?.unit}
            onChange={handleChangeUnit}
          />
        </div>
        <div className="CreateShoppingList__selector">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="有效期限"
              value={isUpdated ? ingredient?.endDate : value}
              onChange={(newValue) => {
                setValue(newValue);
                dispatch({
                  type: actionTypes.SET_INGREDIENT,
                  ingredient: {
                    ...ingredient,
                    endDate: newValue,
                  },
                });
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className="CreateShoppingListisFrozen">
          是否冷凍？
          <Checkbox {...label} onClick="" />
        </div>
        <div className="CreateShoppingListQuantity">
          <h5>備註</h5>
          <Input
            multiline
            type="text"
            name="notes"
            value={isUpdated ? ingredient?.notes : ingredient?.notes}
            onChange={handleChangeNotes}
          />
        </div>
      </div>
      {isUpdated ? (
        <div className="submit">
          <Button
            size="large"
            onClick={isUpdated2 ? modifyData2 : modifyDatatofridge}
          >
            完成修改
          </Button>
        </div>
      ) : (
        <div className="submit">
          <Button size="large" onClick={addDatatofridge}>
            放入冰箱
          </Button>
          <Button size="large" onClick={addDatatoShoppingList}>
            放入購物車
          </Button>
        </div>
      )}
    </div>
  );
}

export default CreateShoppinglist;
