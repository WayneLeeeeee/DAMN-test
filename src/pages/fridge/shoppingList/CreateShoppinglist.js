import React, { useState } from "react";

//components
import TopBar from "../../../components/fridge/CreateShoppinglistBar";
import CustomIcon from "../../../components/Icon";

//firebase
import { db, storage } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
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

  //購物清單結構
  const [shoppingList, setShoppingList] = useState({
    name: "",
    quantity: 0,
    unit: "",
    notes: "",
    endDate: undefined,
    isFrozen: false,
    imageURL: "",
  });

  //set shoppingList
  const handleChangeName = function (value) {
    setShoppingList({ ...shoppingList, name: value });
  };
  const handleChangeisFrozen = function (e) {
    if (shoppingList.isFrozen === false) {
      setShoppingList({ ...shoppingList, isFrozen: true });
    } else {
      setShoppingList({ ...shoppingList, isFrozen: false });
    }
  };
  const handleChange = function (e) {
    setShoppingList({ ...shoppingList, [e.target.name]: e.target.value });
  };
  //縮圖
  const handleThumbnail = (e) => {
    const thumbnail = {
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    };
    setShoppingList({
      ...shoppingList,
      imageURL: thumbnail.url,
      imageFile: thumbnail.file,
    });
  };

  //uplode image
  const upload = async function (file) {
    const imageRef = ref(storage, `food/${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    return url;
  };

  //add to firebase
  async function addDatatoShoppingList() {
    const imgurl = await upload(shoppingList.imageFile);
    const docRef = await addDoc(
      collection(db, "users", `${user}`, "shoppingList"),
      {
        name: shoppingList.name,
        quantity: shoppingList.quantity,
        unit: shoppingList.unit,
        notes: shoppingList.notes,
        endDate: shoppingList.endDate,
        isFrozen: shoppingList.isFrozen,
        imageURL: imgurl,
      }
    );
    navigate("/fridge/shoppinglist");
  }

  async function addDatatofridge() {
    const imgurl = await upload(shoppingList.imageFile);
    const docRef = await addDoc(collection(db, "users", `${user}`, "fridge"), {
      name: shoppingList.name,
      quantity: shoppingList.quantity,
      unit: shoppingList.unit,
      notes: shoppingList.notes,
      endDate: shoppingList.endDate,
      isFrozen: shoppingList.isFrozen,
      imageURL: imgurl,
    });
    navigate("/fridge/fridgemanage");
  }

  console.log(shoppingList);

  return (
    <div className="CreateShoppinglist">
      <TopBar />
      <label htmlFor="icon-button-file">
        <div className="CreateShoppingListImg">
          <img src={shoppingList?.imageURL} alt="" loading="lazy" />
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
              display: `${shoppingList.imageURL ? "none" : "unset"}`,
            }}
          >
            <CustomIcon
              size={80}
              name="AddPhotoAlternateIcon"
              hidden={shoppingList.imageURL ? true : false}
              color="rgb(226, 195, 154)"
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
            value={shoppingList.quantity}
            onChange={handleChange}
          />
        </div>
        <div className="CreateShoppingListQuantity">
          <h5>單位</h5>
          <Input
            type="text"
            name="unit"
            value={shoppingList.unit}
            onChange={handleChange}
          />
        </div>
        <div className="CreateShoppingList__selector">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="有效期限"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
                setShoppingList({ ...shoppingList, endDate: newValue });
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className="CreateShoppingListisFrozen">
          是否冷凍？
          <Checkbox {...label} onClick={handleChangeisFrozen} />
        </div>
        <div className="CreateShoppingListQuantity">
          <h5>備註</h5>
          <Input
            type="text"
            name="notes"
            value={shoppingList.notes}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="submit">
        <Button size="large" onClick={addDatatofridge}>
          放入冰箱
        </Button>
        <Button size="large" onClick={addDatatoShoppingList}>
          放入購物車
        </Button>
      </div>
    </div>
  );
}

export default CreateShoppinglist;
