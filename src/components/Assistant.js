import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
// import { makeStyles } from "@material-ui/styles";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import getTokenOrRefresh from "../function/getTokenOrRefresh";
import { debounce } from "lodash";
import speak from "../function/speak";
import useRecognize from "../hooks/useRecognize";
import moment from "moment";
import useSound from "use-sound";
import sound from "../public/sound/sound.mp3";
// import useSearch from "../hooks/useSearch";
import algoliaSearch from "../function/algoliaSearch";
import RecipeCard from "../components/recipe/RecipeCard";
import { actionTypes } from "../reducer";
import { useStateValue } from "../StateProvider";
import { useNavigate } from "react-router-dom";
import ChineseNumber from "chinese-numbers-converter";
import useToggle from "../hooks/useToggle";
import FridgeCard from "./fridge/FridgeCard";
// import axios from "axios";
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Assistant = () => {
  const userId = localStorage.getItem("userUid"); //使用者id
  let navigate = useNavigate();
  const [playSound] = useSound(sound);
  const [recipeResult, setRecipeResult] = useState(null);
  const [ingredientsResult, setIngredientsResult] = useState(null);
  const [isAllowSTTMicModalOpen, setIsAllowSTTMicModalOpen] = useToggle(true);
  //const [isDialogOpen, setIsDialogOpen] = useState(false); // need to set global state
  const [
    { isAssistantModelOpen, AIResponse, textFromMic, isSTTFromMicOpen },
    dispatch,
  ] = useStateValue();

  // 命令 stt => speech to text
  let STT_Commands = [
    {
      // 語音食譜搜尋
      intent: "Recipe.Search",
      callback: (entities) => {
        STT_handleRecipeSearch(entities);
      },
    },
    {
      // 語音選定 特定編號
      intent: "Utilities.SelectItem",
      callback: (entities) => {
        STT_select_ListenedNumberItem(entities);
      },
    },
    {
      // 語音新增 食材 至 冰箱
      intent: "Fridge.Add",
      callback: (entities) => {
        STT_add_Ingredient(entities);
      },
    },
    {
      // 語音刪除冰箱食材
      intent: "Fridge.DeleteIngredient",
      callback: (entities) => {
        STT_delete_Ingredient(entities);
      },
    },
    {
      // 語音辨別不出意圖時
      intent: "None",
      callback: () => {
        displayAndSpeakResponse("我聽不懂");
      },
    },
  ];
  const [intentInfo, topIntent, clearIntent] = useRecognize(
    textFromMic,
    STT_Commands
  );

  // 關鍵字喚醒
  const AI_Awake = (text) => {
    /*
    清除先前資料（）
    發出 「我在！」語音
    延遲 發出提示音（要等「我在」講完所以要延遲）
    延遲 意圖辨識 要等 提示音 發出所以要延遲）
    打開 小當家 modal (我把 modal 打成 model....) 而且這裡 Dialog == Modal 同樣東西
    */
    clearIntent();
    //setRecipeResult(null);
    if (text) displayAndSpeakResponse(text);
    delayPlaySound();
    delaySTTFromMic();
    dispatch({
      type: actionTypes.SET_IS_ASSISTANT_MODEL_OPEN,
      isAssistantModelOpen: true,
    });
  };

  // 語音執行 Recipe.Search 意圖
  const STT_handleRecipeSearch = async (entities) => {
    const foods = entities.Foods;
    // const food = entities.Food;
    // const recipe = entities.Recipe;
    if (!foods) return;
    let result = await algoliaSearch("recipes", foods[0][0]);

    if (foods?.length <= 0 || result?.length <= 0) {
      displayAndSpeakResponse("沒有找到符合需求的項目");
      return;
    }

    console.log("recipeQuery is: ", foods[0]);

    console.log("ss", result);

    setRecipeResult(result);
    displayAndSpeakResponse(
      `幫您找到 ${result.length} 個關於${foods[0]} 的食譜`
    );
  };

  // 語音執行 Fridge.Add 意圖 -> 新增食材
  const STT_add_Ingredient = async (entities) => {
    const listenedFoodName = entities?.$instance.Foods[0].text;
    // 透過 聽到的食材 搜尋 歷史紀錄（historyIngredients）
    const allHistoryIngredients = await findIngredientsInHistoryIngredient(
      listenedFoodName
    );
    if (!listenedFoodName || !userId || !entities || !allHistoryIngredients) {
      // 如果沒有結果，代表使用者從沒手動新增過這項食材，就說「請先手動新增一次，之後就可以透過語音新增喔」
      speak("聽不懂欲加入的食材，請先手動新增一次，之後就可以透過語音新增喔");
      return;
    }
    if (allHistoryIngredients & listenedFoodName) {
      // 如果有，返回 第一個最新的物件（所有欄位自動帶入）
      const historyItem = allHistoryIngredients[0];
      const duration = historyItem?.duration;
      // 將 endDate （截止日期） 改成 現在日期 + duration
      historyItem.endDate = new Date(moment().add(duration, "days").format());

      console.log("historyItem: ", historyItem);
      await addDoc(collection(db, "users", `${userId}`, "fridge"), historyItem);

      // 新增成功說 “已新增「食材名稱」進冰箱！”
      speak(`已幫您新增${listenedFoodName}至冰箱！`);
      // 跳轉冰箱頁面檢視
      // navigate("fridgePage");
      return;
    }

    // 註：歷史紀錄（historyIngredients）透過  ”名稱“ 來辨識是否新增至 collection
  };

  //  語音執行 Fridge.delete 意圖 -> 刪除食材
  const STT_delete_Ingredient = async (entities) => {
    console.log("delete Ingredients");
    /*
        講完 「找到${fridgeIngredients.length}個相同食材，請問要刪除哪個？」
        延遲 2 秒
        喚醒AI (AI_wake) （continue listened mode）
        說出 「刪除第 X 個」
        呼叫 selectListenedNumberItem() 回傳數字 (這個要將 意圖 Select 那個 移出來)
        透過 數字 - 1 選 fridgeIngredients 並刪除
        stop continue listened mode
    */

    const listenedFoodName = entities?.$instance.Foods[0].text;
    // 將 聽到的食材 從搜尋 Fridge (collection) 找出
    const fridgeIngredients = await findIngredientsInFridge(listenedFoodName);
    setIngredientsResult(fridgeIngredients);

    if (fridgeIngredients?.length === 0) {
      // 如果 0 個，則 說：「未找到您說的食材，請從冰箱確認」
      displayAndSpeakResponse("未找到您說的食材，請從冰箱確認");
    }

    if (fridgeIngredients?.length === 1) {
      // 如果 0 個，則 說：「未找到您說的食材，請從冰箱確認」
      displayAndSpeakResponse(`已從冰箱刪除${listenedFoodName}`);
    }
    if (fridgeIngredients?.length > 1) {
      // 如果大於 1 個，就跳出 modal 讓使用者透過 編號 選擇
      displayAndSpeakResponse(
        `找到${fridgeIngredients.length}個相同食材，請問要刪除哪個？`
      );
      const delayAI_Awake = debounce(AI_Awake, 2000);
      delayAI_Awake();
    }
  };

  //  語音執行 Utilities.SelectItem 意圖
  const STT_select_ListenedNumberItem = async (entities) => {
    /* 
    Actions:
    1. 食譜選擇，利用語音控制並開啟第幾道的食譜
      「開啟第一道食譜。」
    2. 冰箱食材刪除(如果找到項目超過 1 個)
      「刪除第一項」
    3. 
    */
    const number = entities.ordinal[0];
    const index = number - 1;

    // if (!recipeResult) {
    //   displayAndSpeakResponse("您需要先講出查詢何種食譜，我才能為您開啟");
    //   return;
    // }

    // case1: 食譜選擇，利用語音控制並開啟第幾道的食譜
    if (recipeResult & index) {
      displayAndSpeakResponse(`幫您開啟第${number}道食譜`);
      dispatch({
        type: actionTypes.SET_IS_ASSISTANT_MODEL_OPEN,
        isAssistantModelOpen: false,
      });
      setRecipeResult(null);
      /*
        無法 navigating to a sibling
        例如 從 /recipe/:recipeUUID_1 到 /recipe/:recipeUUID_2
        是沒有作用的，目前找不到解決辦法
        相似的 issue 
        https://stackoverflow.com/questions/68825965/react-router-v6-usenavigate-doesnt-navigate-if-replacing-last-element-in-path
        */
      navigate(`/recipe/${recipeResult[index]?.objectID}`, { replace: true });
    }

    // case2: 冰箱食材刪除(如果找到項目超過 1 個)
    if (ingredientsResult?.length > 1) {
      deleteIngredient(index);
    }

    //window.location.reload();

    // return listened number
  };

  // 冰箱食材刪除
  const deleteIngredient = async (index) => {
    const ingredientId = ingredientsResult[index].id;
    await deleteDoc(doc(db, "users", `${userId}`, "fridge", ingredientId));
    displayAndSpeakResponse(`幫您刪除第${index + 1}個食材`);
    console.log(`幫您刪除第${index + 1}個食材, id: ${ingredientId}`);
    setIngredientsResult(null);
  };

  // 麥克風語音辨識
  const sttFromMic = async (configs) => {
    // if(!isAssistantModelOpen) return console.log("model not open");
    console.log(configs);
    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      tokenObj.authToken,
      tokenObj.region
    );
    speechConfig.speechRecognitionLanguage = "zh-TW";

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    let text;
    if (configs.mode === "keywordRecognizer") {
      recognizer.startContinuousRecognitionAsync();
      //  The event recognizing signals that an intermediate recognition result is received.
      // recognizer.recognizing = function (s, e) {
      //   //console.log("recognizing text", e.result.text);
      // };
      dispatch({
        type: actionTypes.SET_IS_STT_FROM_MIC_OPEN,
        isSTTFromMicOpen: true,
      });

      //  The event recognized signals that a final recognition result is received.
      recognizer.recognized = async function (script, e) {
        console.log("recognized text", e.result.text);
        const recognizedText = e.result.text;
        // const res = await axios.get(
        //   `https://damn-token.herokuapp.com/api/cut-text?q=${recognizedText}`
        // );
        //console.log("res array : ", res);
        if (recognizedText === "小當家。") {
          // dispatch({
          //   type: actionTypes.SET_TEXT_FROM_MIC,
          //   textFromMic: recognizedText,
          // });
          AI_Awake("我在");
        }
      };
      // console.log("辨別出", text);
    }
    if (configs.mode === "intentRecognizer") {
      text = recognizer.recognizeOnceAsync((result) => {
        let displayText;
        //console.log("result.text: ", result.text);
        if (result.reason === ResultReason.RecognizedSpeech) {
          //displayText = `RECOGNIZED: Text=${result.text}`;
          /*
          ChineseNumber package
          將 中文數字 轉成 阿拉伯數字
          例如： 打開第四道食譜 －> 打開第4道食譜
          */
          displayText = new ChineseNumber(result.text).toArabicString();
          dispatch({
            type: actionTypes.SET_TEXT_FROM_MIC,
            textFromMic: displayText,
          });
        } else {
          displayText =
            "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
        }
        //setDisplayText(result.text);
        return displayText;
      });
    }
    if (configs.mode === "stopListening") {
      recognizer.stopContinuousRecognitionAsync();
      return;
    }

    return text;
  };

  // 延遲 語音辨識
  const delaySTTFromMic = debounce(async () => {
    // 延遲 1.8 秒，開啟命令用語音
    // 因為語音辨識會把 “我在“ 一起錄進去
    // 1.8 秒後應該要有 提示音
    sttFromMic({ mode: "intentRecognizer" });
  }, 2000);

  // 延遲 提示音
  const delayPlaySound = debounce(() => {
    playSound();
  }, 1200);

  // 顯示 AI 回覆 與 說出合成語音
  const displayAndSpeakResponse = async (text) => {
    speak(text);
    dispatch({
      type: actionTypes.SET_AI_RESPONSE,
      AIResponse: text,
    });
  };

  // 開始監聽
  const startListening = () => {
    sttFromMic({ mode: "keywordRecognizer" });
    setIsAllowSTTMicModalOpen();
  };
  // 停止監聽
  const stopListening = () => {
    sttFromMic({ mode: "stopListening" });
  };

  // 查詢 collection (historyIngredient 或 fridge) 有同樣名字的食材
  const findIngredients = async (collectionName, ingredientName) => {
    // 查詢 collection (historyIngredient) 有同樣名字的食材
    if (!userId) return;
    let tempList = [];
    const q = query(
      collection(db, "users", `${userId}`, collectionName),
      where("name", "==", ingredientName)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      tempList.push({ id: doc.id, ...doc.data() });
    });
    console.log("tempList: ", tempList);
    return tempList;
  };
  const findIngredientsInHistoryIngredient = findIngredients.bind(
    this,
    "historyIngredient"
  );
  const findIngredientsInFridge = findIngredients.bind(this, "fridge");

  // 小當家彈出視窗關閉
  const handleDialogClose = () => {
    /*
    清除資料
    */
    dispatch({
      type: actionTypes.SET_IS_ASSISTANT_MODEL_OPEN,
      isAssistantModelOpen: false,
    });

    dispatch({
      type: actionTypes.SET_AI_RESPONSE,
      AIResponse: "",
    });
    dispatch({
      type: actionTypes.SET_TEXT_FROM_MIC,
      textFromMic: "",
    });
    setRecipeResult(null);
  };

  // 初始化 渲染元件
  useEffect(() => {
    // SpeechRecognition.startListening({ continuous: true, language: "zh-TW" });
    sttFromMic({ mode: "keywordRecognizer" });
    // 一個 modal 初始化時顯示，提供給使用者 是否開啟語音助理
  }, []);

  // 當 isSTTFromMicOpen 變動
  useEffect(() => {
    if (!isSTTFromMicOpen) {
      //console.log("stop");
      stopListening();
      return;
    }
  }, [isSTTFromMicOpen]);

  // 當 isAssistantModelOpen 變動
  useEffect(() => {
    // 如果 小當家 modal 關閉，清除 小當家先前回覆 和 先前辨識的句子
    if (!isAssistantModelOpen) {
      setRecipeResult(null);
      dispatch({
        type: actionTypes.SET_AI_RESPONSE,
        AIResponse: "",
      });
      dispatch({
        type: actionTypes.SET_TEXT_FROM_MIC,
        textFromMic: "",
      });
    }
  }, [isAssistantModelOpen]);

  console.log("意圖: ", intentInfo);
  console.log("第二監聽: ", textFromMic);
  //console.log(recipeResult);
  return (
    <div className="assistant">
      <Dialog
        className="dialogContainer"
        maxWidth="sm"
        open={isAssistantModelOpen}
        TransitionComponent={Transition}
        keepMounted
        //onClose={handleDialogClose}
        onBackdropClick={handleDialogClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter: "blur(10px)",
          //other styles here
        }}
      >
        <Box
        // sx={{ width: "100%", position: "absolute", top: 0, height: "100%" }}
        >
          {recipeResult?.map((recipe, index) => (
            <RecipeCard
              key={recipe.objectID}
              recipeData={recipe}
              index={index}
            />
          ))}
        </Box>
        
        <Box
        // sx={{ width: "100%", position: "absolute", top: 0, height: "100%" }}
        >
          {ingredientsResult?.map((ingredient, index) => (
            <FridgeCard
              item={ingredient}
              index={index}
              // openEditDialog={openEditDialog}
              // openDeleteDialog={openDeleteDialog}
            />
          ))}
        </Box>

        <DialogTitle sx={{ color: "#444545" }}>{textFromMic}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ color: "rgb(254, 139, 131)" }}>
            {AIResponse}
          </Typography>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAllowSTTMicModalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={setIsAllowSTTMicModalOpen}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="color-primary">
          開啟小當家，便利你的生活
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            開啟小當家功能，只要喊「小當家」即可喚醒！ 詳細功能可參考 語音文件
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={setIsAllowSTTMicModalOpen}>語音文件</Button>
          <Button className="color-primary" onClick={startListening}>
            開啟
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Assistant;
