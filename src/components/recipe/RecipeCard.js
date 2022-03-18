import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
const RecipeCard = ({ recipeData,index }) => {
  let navigate = useNavigate();
  const [{ isAssistantModelOpen }, dispatch] = useStateValue();

  const goToRecipeDetailPage = () => {
    console.log(recipeData.objectID);
    navigate(`/recipe/${recipeData.objectID}`);
    dispatch({
      type: actionTypes.SET_IS_ASSISTANT_MODEL_OPEN,
      isAssistantModelOpen: false,
    });
  };

 // useEffect(() => {}, [recipeData]);
  return (
    <Card sx={{ display: "flex", my: 2, mx: 2 }} onClick={goToRecipeDetailPage}>
      <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {recipeData?.name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {index + 1}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          {/* <IconButton aria-label="previous">
            {theme.direction === "rtl" ? (
              <SkipNextIcon />
            ) : (
              <SkipPreviousIcon />
            )}
          </IconButton>
          <IconButton aria-label="play/pause">
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === "rtl" ? (
              <SkipPreviousIcon />
            ) : (
              <SkipNextIcon />
            )}
          </IconButton> */}
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        src={recipeData?.thumbnail?.url}
        alt="Live from space album cover"
      />
    </Card>
  );
};

export default RecipeCard;
