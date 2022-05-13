import React, { useState } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import NameAndThumbnail from "../../components/recipe/addRecipe/NameAndThumbnail";
import RecipeSteps from "../../components/recipe/addRecipe/RecipeSteps";
import RecipeRating from "../../components/recipe/addRecipe/RecipeRating";
import RecipeIngredients from "../../components/recipe/addRecipe/RecipeIngredients";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../function/theme";
import ReviewRecipe from "../../components/recipe/addRecipe/PreviewRecipe";
import ButtomNav from "../../components/BottomNav";
import { Typography } from "@mui/material";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

export default function AddRecipeStepper() {
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: "輸入食譜名稱,  縮圖",
      component: <NameAndThumbnail />,
    },
    {
      label: "選擇所需食材標籤",
      component: <RecipeIngredients />,
    },
    {
      label: "新增食材步驟",
      component: <RecipeSteps />,
    },
    { label: "預覽頁面並發布食譜", component: <ReviewRecipe /> },
  ];
  const maxSteps = steps.length;
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="add">
      <ThemeProvider theme={theme}>
        <div className="add__title">
          <h3>食譜投稿</h3>
          <LocalDiningIcon />
        </div>
        {/* 子頁面 元件 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="addRecipePage">{steps[activeStep].component}</div>
          {/* 上一步 下一步 */}
          <MobileStepper
            sx={{
              position: "fixed",
              bottom: "80px",
              width: "100%",
              bgcolor: "transparent",
            }}
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
                sx={{ color: "primary.main" }}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ color: "primary.main" }}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
              </Button>
            }
          />
        </Box>

        <ButtomNav />
      </ThemeProvider>
    </div>
  );
}
