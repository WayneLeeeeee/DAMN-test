import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/system";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { actionTypes } from "../../../reducer";
import { useStateValue } from "../../../StateProvider";
import useSearch from "../../../hooks/useSearch";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
// import { useSpeechRecognition } from "react-speech-recognition";
// import { split } from "lodash";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
var temp = [];

// mock unit data
const unitData = [
  { id: 1, name: "公克" },
  { id: 2, name: "斤" },
  { id: 3, name: "半匙" },
  { id: 3, name: "顆" },
  { id: 3, name: "把" },
];
const RecipeIngredients = () => {
  const [servingCount, setServingCount] = useState(1);
  const [cookTime, setCookTime] = useState(0);
  const [selectedIngredientTags, setSelectedIngredientTags] = useState([]);
  const [selectedIngredientsInfo, setSelectedIngredientsInfo] = useState([]);
  const [mainIngredient, setMainIngredient] = useState(false);
  const [{ newRecipeData, isUpdated }, dispatch] = useStateValue();

  // const [{ newRecipeData }, dispatch] = useStateValue();
  const [searchTerm, setSearchTerm] = useState("");
  const ingredientsData = useSearch("ingredients", searchTerm);
  // 冰箱查詢
  const result = useSearch("fridge", searchTerm, "3HuEsCE9jUlCm68eBQf4");
  console.log("result: ", result);

  // console.log("selectedIngredientTags: ", selectedIngredientTags);

  // 以下註解是我用來測試食譜語音搜尋的實驗
  // const commands = [
  //   {
  //     command: ["幫我搜尋*", "查詢*"],
  //     callback: (command) => {
  //       //  handleSpeakAndResponse("什麼事？");
  //       console.log(command);
  //       const query = split(finalTranscript, command).pop();
  //       console.log(query);

  //       setSearchTerm(query);
  //     },
  //     isFuzzyMatch: true, // 模糊匹配
  //     bestMatchOnly: true,
  //     matchInterim: true,
  //   },
  // ];
  // const { finalTranscript } = useSpeechRecognition({ commands });

  function removeA(arr) {
    var what,
      a = arguments,
      L = a.length,
      ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  }

  // 修改份數 serving
  const handleServingCount = (e) => {
    setServingCount(e.target.value);
    dispatch({
      type: actionTypes.SET_NEWRECIPEDATA,
      newRecipeData: { ...newRecipeData, serving: parseInt(e.target.value) },
    });
  };

  // 修改料理時間 cookTime
  const handleCookTime = (e) => {
    setCookTime(e.target.value);
    dispatch({
      type: actionTypes.SET_NEWRECIPEDATA,
      newRecipeData: { ...newRecipeData, cookTime: parseInt(e.target.value) },
    });
  };

  // 食材標籤
  const handleIngredientTags = (value) => {
    setSelectedIngredientTags(value);
    dispatch({
      type: actionTypes.SET_NEWRECIPEDATA,
      newRecipeData: {
        ...newRecipeData,
        ingredientTags: value,
      },
    });
  };

  const handleMainIngredient = (name) => {
    const found = temp.find((element) => element === name);
    if (found) {
      setMainIngredient(false);
      removeA(temp, name);
      dispatch({
        type: actionTypes.SET_NEWRECIPEDATA,
        newRecipeData: {
          ...newRecipeData,
          ingredientRecommendTags: temp,
        },
      });
    } else {
      temp.push(name);
      setMainIngredient(true);
      dispatch({
        type: actionTypes.SET_NEWRECIPEDATA,
        newRecipeData: {
          ...newRecipeData,
          ingredientRecommendTags: temp,
        },
      });
    }
  };

  console.log(temp);

  // 選中食材的量
  const handleIngredientCount = (e, id, name) => {
    const info = [...selectedIngredientsInfo];
    info[id] = {
      ...info[id],
      name: name,
      count: e.target.value,
    };
    setSelectedIngredientsInfo(info);
    dispatch({
      type: actionTypes.SET_NEWRECIPEDATA,
      newRecipeData: {
        ...newRecipeData,
        ingredientsInfo: info,
        // ingredientRecommendTags: [info[id].name],
      },
    });
  };

  // 選中食材單位
  const handleIngredientUnit = (id, value) => {
    // console.log(`selected: ${id} unit: ${unit}`);
    const info = [...selectedIngredientsInfo];
    info[id] = {
      ...info[id],
      unit: value,
    };
    setSelectedIngredientsInfo(info);
    dispatch({
      type: actionTypes.SET_NEWRECIPEDATA,
      newRecipeData: { ...newRecipeData, ingredientsInfo: info },
    });
  };

  // 搜尋欄 onChange 事件
  const onSearchChange = (e) => setSearchTerm(e.target.value);

  useEffect(() => {
    if (newRecipeData.ingredientsInfo?.length !== 0) {
      setSelectedIngredientsInfo(newRecipeData?.ingredientsInfo);
    }

    if (newRecipeData.ingredientTags?.length !== 0) {
      setSelectedIngredientTags(newRecipeData?.ingredientTags);
    }
  }, []);

  console.log(newRecipeData);

  return (
    <Box sx={{ p: 2 }}>
      {/*  適合人份  */}
      <FormControl fullWidth sx={{ margin: "20px 0px" }} required>
        <InputLabel htmlFor="outlined-adornment-amount">人數</InputLabel>
        <OutlinedInput
          type="number"
          id="outlined-adornment-amount"
          value={isUpdated ? newRecipeData?.serving : servingCount}
          onChange={handleServingCount}
          endAdornment={<InputAdornment position="start">人份</InputAdornment>}
          label="Serving"
        />
      </FormControl>
      {/*  料理時間  */}
      <FormControl fullWidth sx={{ margin: "20px 12x" }} required>
        <InputLabel htmlFor="outlined-adornment-amount">料理時間</InputLabel>
        <OutlinedInput
          type="number"
          id="outlined-adornment-amount"
          value={isUpdated ? newRecipeData?.cookTime : cookTime}
          onChange={handleCookTime}
          endAdornment={<InputAdornment position="start">分鐘</InputAdornment>}
          label="CookTime"
        />
      </FormControl>
      {/* 搜尋食材 search bar */}
      <h3>所需食材</h3>
      <h4 style={{ color: "#FE8B83" }}>核心食材請打勾！</h4>
      <Autocomplete
        id="selectedIngredientTags"
        multiple
        disableCloseOnSelect
        options={ingredientsData}
        noOptionsText="沒有ㄝ~試試其他關鍵字吧！"
        groupBy={(option) => option.firstLetter}
        getOptionLabel={(option) => option.name}
        onChange={(__, value) => handleIngredientTags(value)}
        onInputChange={onSearchChange}
        sx={{ width: "100%", marginTop: "20px" }}
        // isOptionEqualToValue={(option, value) => option.id === value.id}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        renderInput={(params) => <TextField {...params} label="搜尋食材" />}
      />
      {/* 列出所選食材所需單位 text field */}
      {selectedIngredientTags.map((selectedIngredient, index) => (
        <Box
          key={selectedIngredient?.id}
          sx={{ display: "flex", alignItems: "center", my: 2 }}
        >
          <Checkbox
            onClick={() => handleMainIngredient(selectedIngredient.name)}
            sx={{ color: "#FE8B83" }}
          />
          <TextField
            label={`食材`}
            type="number"
            id="standard-start-adornment"
            sx={{ my: 2, flex: 1, marginLeft: "10px" }}
            defaultValue={selectedIngredientsInfo[index]?.count}
            onChange={(e) =>
              handleIngredientCount(e, index, selectedIngredient?.name)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {selectedIngredient.name} :
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={unitData}
            freeSolo
            getOptionLabel={(option) => option.name}
            defaultValue={selectedIngredient?.unit?.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => handleIngredientUnit(index, value)}
            sx={[
              { width: "100px" },
              {
                "&  .css-4n7jhh-MuiInputBase-root-MuiInput-root": {
                  mt: "16px",
                },
              },
              {
                "& .css-1q60rmi-MuiAutocomplete-endAdornment": {
                  top: 0,
                },
              },
            ]}
            renderInput={(params) => (
              <TextField
                variant="standard"
                {...params}
                onChange={(e) => handleIngredientUnit(index, e.target.value)}
                label="單位"
              />
            )}
          />
        </Box>
      ))}
    </Box>
  );
};

export default RecipeIngredients;
