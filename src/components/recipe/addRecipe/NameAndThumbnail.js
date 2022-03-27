import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { actionTypes } from "../../../reducer";
import { useStateValue } from "../../../StateProvider";
import { Box, ThemeProvider } from "@mui/system";
import { styled } from "@mui/material/styles";
import theme from "../../../function/theme";
import CustomIcon from "../../Icon";
import RecipeRating from "../../../components/recipe/addRecipe/RecipeRating";
import { Typography } from "@mui/material";


const NameAndThumbnail = ({ recipeData, setRecipeData, recipes }) => {
  const Input = styled("input")({
    display: "none",
  });
  const [{ newRecipeData, isUpdated }, dispatch] = useStateValue();
  const [name, setName] = useState("");

  // 修改食譜名稱
  const handleRecipeName = (e) => {
    setName(e.target.value);
    dispatch({
      type: actionTypes.SET_NEWRECIPEDATA,
      newRecipeData: { ...newRecipeData, name: e.target.value },
    });
  };

  // 顯示 食譜縮圖 (show recipe thumbnail)
  const handleRecipeThumbnail = (e) => {
    const thumbnail = {
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    };
    dispatch({
      type: actionTypes.SET_NEWRECIPEDATA,
      newRecipeData: { ...newRecipeData, thumbnail: thumbnail },
    });
  };

  useEffect(() => {
    if (newRecipeData) {
      setName(newRecipeData.name);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
     
      <Box sx={{ p: 2, color: "text.normal" }}>
        {/* 食譜名稱 */}
        <Typography variant="h6" gutterBottom component="div">
          食譜名稱
        </Typography>
        <TextField
          fullWidth
          id="name"
          label="食譜名稱"
          variant="outlined"
          maxRows={4}
          required
          margin="dense"
          onChange={handleRecipeName}
          value={isUpdated ? newRecipeData?.name : name}
        />{" "}
        {/* 食譜封面圖片 */}
        <Typography variant="h6" gutterBottom component="div">
          食譜封面圖片
        </Typography>
        <label htmlFor="icon-button-file">
          <Box
            component="div"
            sx={{
              p: 2,
              border: "1px dashed grey",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "primary.main",
            }}
          >
            {/* <img src={newRecipeData?.thumbnail?.url} alt="" loading="lazy" /> */}
            <img
              src={
                isUpdated
                  ? newRecipeData?.thumbnail?.url
                  : newRecipeData?.thumbnail?.url
              }
              alt=""
              loading="lazy"
            />
            <Input
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={handleRecipeThumbnail}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              style={{
                display: `${newRecipeData.thumbnail ? "none" : "unset"}`,
              }}
            >
              <CustomIcon
                size={80}
                name="AddPhotoAlternateIcon"
                hidden={newRecipeData.thumbnail ? true : false}
              />
            </IconButton>
          </Box>
        </label>
        {/* rating */}
        <Typography variant="h6" gutterBottom component="div" sx={{ mt: 2 }}>
          難易度
        </Typography>
        <RecipeRating />
      </Box>
    </ThemeProvider>
  );
};

export default NameAndThumbnail;
