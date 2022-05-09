import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { actionTypes } from "../../../reducer";
import { useStateValue } from "../../../StateProvider";
const labels = {
  0.5: "入門",
  1: "新手",
  1.5: "進階",
  2: "銅牌",
  2.5: "銀牌",
  3: "金牌",
  3.5: "白金",
  4: "鑽石",
  4.5: "大師",
  5: "小當家",
};
export default function RecipeRating() {
  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);
  const [{ newRecipeData, isUpdated }, dispatch] = useStateValue();

  const handleRating = (value) => {
    setValue(value);
    dispatch({
      type: actionTypes.SET_NEWRECIPEDATA,
      newRecipeData: { ...newRecipeData, rating: value },
    });
  };

  useEffect(() => {
    if (newRecipeData.rating) {
      setValue(newRecipeData.rating);
    }
  }, []);
  return (
    <Box
      sx={{
        // width: 200,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Rating
        name="hover-feedback"
        size="large"
        value={isUpdated?newRecipeData?.rating:value}
        precision={0.5}
        onChange={(event, newValue) => {
          handleRating(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : isUpdated?newRecipeData?.rating:value]}</Box>
      )}
    </Box>
  );
}
