import { Button, Divider, Fab, IconButton, TextField } from "@material-ui/core";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { actionTypes } from "../../../reducer";
import { useStateValue } from "../../../StateProvider";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

const initStepsList = [{ content: "" }, { content: "" }, { content: "" }];

const RecipeSteps = () => {
  const [stepsList, setStepsList] = useState([]);
  const [{ newRecipeData }, dispatch] = useStateValue();
  useEffect(() => {
    setStepsList(initStepsList);
    if (newRecipeData?.steps?.length !== 0) {
      setStepsList(newRecipeData.steps);
    }
  }, []);

  // send data to global state
  const sendDataToGlobalState = (list) => {
    dispatch({
      type: actionTypes.SET_NEWRECIPEDATA,
      newRecipeData: {
        ...newRecipeData,
        steps: list,
      },
    });
  };

  // 新增步驟
  const createStepInputField = () => {
    setStepsList([...stepsList, { content: "" }]);
    sendDataToGlobalState([...stepsList, { content: "" }]);
  };
  // 刪除步驟
  const deleteStepInputField = (id) => {
    const listWithoutSelectedInput = [...stepsList].filter(
      (_, index) => index !== id
    );
    setStepsList(listWithoutSelectedInput);
    sendDataToGlobalState(listWithoutSelectedInput);
  };

  // 在 步驟欄 寫下 敘述
  const handleStepContent = (e, id) => {
    const { value } = e.target;
    const list = [...stepsList];
    list[id] = { ...list[id], content: value };
    // console.log("selected step content id: ", id);
    setStepsList(list);
    sendDataToGlobalState(list);
  };

  // 在步驟欄顯示 步驟圖片
  const showStepImage = (e, id) => {
    const { files } = e.target;
    const list = [...stepsList];

    // console.log("selected step image id: ", id);
    list[id] = {
      ...list[id],
      image: files[0],
      imageURL: URL.createObjectURL(files[0]),
    };
    setStepsList(list);
    sendDataToGlobalState(list);
  };
  console.log("stepsList: ", stepsList);

  return (
    <Box sx={{ p: 2 }}>
      {/* map 所有步驟 透過按鈕新增刪除 inputField */}
      {stepsList.map((_, id) => (
        <Box className="stepInputFieldContainer" key={id}>
          <TextField
            fullWidth
            id="filled-multiline-flexible"
            label={`步驟 ${id + 1}`}
            multiline
            margin="normal"
            rows={2}
            variant="outlined"
            value={stepsList[id]?.content}
            onChange={(e) => handleStepContent(e, id)}
          />
          {/* 步驟圖片顯示 */}
          <label htmlFor="icon-button-file">
            {/* 不要用 Input 會有問題 */}
            <input
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={(e) => showStepImage(e, id)}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
          <img src={stepsList[id]?.imageURL} alt="" loading="lazy" />
          <Fab
            className="deleteStepBtn"
            onClick={() => deleteStepInputField(id)}
            variant="circular"
            size="small"
          >
            <RemoveIcon />
          </Fab>
          <Divider variant="middle" />
        </Box>
      ))}
      {/* 新增食譜步驟按鈕 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 1,
          m: 1,
          bgcolor: "background.paper",
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={createStepInputField}
        >
          新增步驟
        </Button>
      </Box>
    </Box>
  );
};

export default RecipeSteps;
