import React from "react";
import RecipeItem from "../../../pages/recipe/RecipeItemPage";
import { useStateValue } from "../../../StateProvider";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import theme from "../../../function/theme";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Timestamp } from "firebase/firestore";
import { updateDoc, doc, addDoc, collection } from "firebase/firestore";
import { storage, db } from "../../../firebase";
import { actionTypes } from "../../../reducer";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import { Paper } from "@mui/material";
import Tabs from "../../../pages/recipe/Tabs";
import ImageStepper from "../../ImageStepper";
import client from "../../../sanity";
import { basename } from "path";
import { createReadStream } from "fs";
const PreviewRecipe = () => {
  const navigate = useNavigate();
  const [{ newRecipeData, isUpdated }, dispatch] = useStateValue();
  const userId = localStorage.getItem("userUid");

  // 表單送出
  const handleSubmit = async () => {
    const result = {
      ...newRecipeData,
      //createdAt: Timestamp.now().toDate(),
      //thumbnail: await getRemoteThumbnailURL(),
      steps: await getStepsWithRemoteImageURL(),
      // author: user,
    };

    // dispatch({
    //   type: actionTypes.SET_ISUPDATED,
    //   isUpdated: false,
    // });
    clearStepsBlankContent();
    console.log(result);

    // 傳送至 fireStore
    if (isUpdated) {
      // const washingtonRef = doc(db, "recipes", newRecipeData?.id);
      // await updateDoc(washingtonRef, {
      //   name: result.name,
      //   rating: result.rating,
      //   likes: result.likes,
      //   serving: result.serving,
      //   ingredientsInfo: result.ingredientsInfo,
      //   ingredientTags: result.ingredientTags,
      //   steps: result.steps,
      //   createdAt: Timestamp.now().toDate(),
      // });
      // const doc = { ...result, _type: "recipe", _id: "" };
      // client.createOrReplace(doc).then((res) => {
      //   console.log(`Bike was created, document ID is ${res._id}`);
      // });
    } else {
      // const docRef = await addDoc(collection(db, "recipes"), result);
      // console.log("Document written with ID: ", docRef.id);
    }
    let doc_id = "";
    console.log(userId)
    const doc = {
      _type: "recipes",
      title: result.name,
      likes: result.likes,
      rating: result.rating,
      serving: result.serving,
      cookTime: result.cookTime,
      user: { _type: "reference", _ref: userId },
      steps: result.steps,
      ingredientRecommendTags: result.ingredientRecommendTags,
      ingredientTags: result.ingredientTags,
      //thumbnail: await getURL(newRecipeData?.thumbnail.file), // need to fix
    };

    console.log("doc: ", doc);

    // 創造資料進 sanity content lake（只有靜態資料，因為 image 需要綁定，需要先有 document _id）
    await client.create(doc).then((res) => {
      console.log(`Recipe was created, document ID is ${res._id}`);
      doc_id = res._id;
    });

    await uploadImages(newRecipeData?.thumbnail.file, doc_id);

    // 將 圖片上傳 並參考至該 document

    initNewRecipeData(); // need to clear global state

    // navigate to homepage page
    navigate("/");
  };

  const initNewRecipeData = () => {
    dispatch({
      type: actionTypes.SET_NEWRECIPEDATA,
      newRecipeData: {
        name: "",
        rating: 2,
        likes: 0,
        serving: 1,
        ingredientsInfo: [],
        ingredientTags: [],
        steps: [],
      },
    });
  };

  // 取得遠端網址的方法
  const getSingleRemoteURL = async (file) => {
    if (!file) return;
    // 記得取出圖片檔案格式結尾 (e.g. .jpg .png ...
    const recipesRef = ref(storage, `recipes/${uuidv4()}.jpg`);

    //const recipesRef = ref(storage, `recipes/${file.name}`);
    const metadata = { ...file };
    // {
    //   name: file.name,
    //   contentType: file.type,
    //   lastModified: file.lastModified,
    //   size: file.size,
    //   lastModifiedDate: file.lastModifiedDate,
    // };
    console.log(metadata);
    await uploadBytes(recipesRef, file, metadata)
      .then((snapshot) => {
        console.log("Uploaded success");
      })
      .catch((error) => {
        // Handle any errors
      });

    return await getDownloadURL(recipesRef);
  };

  // 上傳並取得遠端網址 sanity
  const uploadImages = async (file, _id) => {
    // 第一個參數  可以是 物件 或是 array
    // 第二個參數 是 要綁定（參考）的文件 _id
    if (!file || !_id) return console.log(`${_id} or ${file}`);
    console.log(file, _id);

    if (Array.isArray(file)) {
      console.log("is a file array");
      return;
    }
    // 如果是單一個檔案
    client.assets
      .upload("image", file, {
        filename: basename(file.name),
      })
      .then((imageAsset) => {
        // Here you can decide what to do with the returned asset document.
        // If you want to set a specific asset field you can to the following:
        console.log(imageAsset);
        return client
          .patch(_id)
          .set({
            "thumbnail": {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: imageAsset._id,
              },
            },
          })
          .commit();
      })
      .then(() => {
        console.log("Done!");
      });
  };

  // 取得縮圖的遠端網址
  const getRemoteThumbnailURL = async () => {
    const temp = {
      url: await getSingleRemoteURL(newRecipeData?.thumbnail?.file),
    };
    return temp;
  };
  // 取得步驟圖片遠端網址
  const getStepsWithRemoteImageURL = async () => {
    const remoteImageURLWithSteps = await Promise.all(
      newRecipeData?.steps.map(async (step) => {
        if (!step.image) return step;
        step.imageURL = await getSingleRemoteURL(step.image);
        delete step.image;
        return step;
      })
    );
    return remoteImageURLWithSteps;
  };

  // 將沒有內容的步驟去除，以免造成資料庫冗余資料
  const clearStepsBlankContent = () => {
    // console.log("clear");
    const steps = newRecipeData?.steps;
    steps.map((step, id) => step.content.length === 0 && steps.splice(id, 1));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4 }}>
        <h3>預覽食譜</h3>
        <ThemeProvider theme={theme}>
          <Paper
            elevation={3}
            className="recipeItem__container"
            sx={{ color: "text.normal", height: "350px", overflow: "auto" }}
          >
            <div className="recipeItem__wrap">
              <img src={newRecipeData?.thumbnail?.url} alt="" />
            </div>
            {/* 食材 或 步驟 選項 */}
            <Tabs data={newRecipeData} />
          </Paper>
        </ThemeProvider>
        {/* submit button */}
        <Button
          className="addRecipePage__submitBtn"
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 2 }}
          variant="contained"
        >
          {isUpdated ? "修改" : "發布"}食譜
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default PreviewRecipe;
