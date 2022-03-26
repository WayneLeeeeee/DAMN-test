import React, { useEffect, useState } from "react";

import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Slide,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import getTokenOrRefresh from "../function/getTokenOrRefresh";
import { debounce } from "lodash";
import speak from "../function/speak";
import useRecognize from "../hooks/useRecognize";

import useSound from "use-sound";
import sound from "../public/sound/sound.mp3";
import useSearch from "../hooks/useSearch";
import algoliaSearch from "../function/algoliaSearch";
import RecipeCard from "../components/recipe/RecipeCard";
import { actionTypes } from "../reducer";
import { useStateValue } from "../StateProvider";
import { useNavigate } from "react-router-dom";
import ChineseNumber from "chinese-numbers-converter";
import useToggle from "../hooks/useToggle";
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Assistant = () => {
  let navigate = useNavigate();
  const [playSound] = useSound(sound);
  //const [isDialogOpen, setIsDialogOpen] = useState(false); // need to set global state
  const [{ isAssistantModelOpen, AIResponse, textFromMic }, dispatch] =
    useStateValue();
  const [recipeResult, setRecipeResult] = useState(null);
  const [isAllowSTTMicModalOpen, setIsAllowSTTMicModalOpen] = useToggle(true);
  // 命令 stt => speech to text
  let STT_Commands = [
    {
      intent: "Recipe.Search",
      callback: (entities) => {
        handleRecipeSearch(entities);
      },
    },
    {
      intent: "Utilities.SelectItem",
      callback: async (entities) => {
        // 利用語音控制並開啟第幾道的食譜
        const number = entities.ordinal[0];
        const index = number - 1;
        if (!recipeResult) {
          displayAndSpeakResponse("您需要先講出查詢何種食譜，我才能為您開啟");
          return;
        }

        await displayAndSpeakResponse(`幫您開啟第${number}道食譜`);
        dispatch({
          type: actionTypes.SET_IS_ASSISTANT_MODEL_OPEN,
          isAssistantModelOpen: false,
        });
        /*
        無法 navigating to a sibling
        例如 從 /recipe/:recipeUUID_1 到 /recipe/:recipeUUID_2
        是沒有作用的，目前找不到解決辦法
        相似的 issue 
        https://stackoverflow.com/questions/68825965/react-router-v6-usenavigate-doesnt-navigate-if-replacing-last-element-in-path
        */
        navigate(`/recipe/${recipeResult[index]?.objectID}`, { replace: true });

        //window.location.reload();
      },
    },
    {
      intent: "Assistant.Stay",
      callback: () => {
        // ...
        displayAndSpeakResponse("已開啟監聽模式");
      },
    },
    {
      intent: "None",
      callback: () => {
        // 如果意圖分辨不出來
        displayAndSpeakResponse("我聽不懂");
      },
    },
  ];
  const [intentInfo, topIntent, clearIntent] = useRecognize(
    textFromMic,
    STT_Commands
  );

  // 關鍵字喚醒
  const AI_Awake = () => {
    /*
    清除先前資料（）
    發出 「我在！」語音
    延遲 發出提示音（要等「我在」講完所以要延遲）
    延遲 意圖辨識 要等 提示音 發出所以要延遲）
    打開 小當家 modal (我把 modal 打成 model....) 而且這裡 Dialog == Modal 同樣東西
    */
    clearIntent();
    setRecipeResult(null);
    displayAndSpeakResponse("我在");
    delayPlaySound();
    delaySTTFromMic();
    dispatch({
      type: actionTypes.SET_IS_ASSISTANT_MODEL_OPEN,
      isAssistantModelOpen: true,
    });
  };

  // 語音執行 Recipe.Search 意圖
  const handleRecipeSearch = async (entities) => {
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

  // 語音辨識
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

      //  The event recognized signals that a final recognition result is received.
      recognizer.recognized = function (script, e) {
        console.log("recognized text", e.result.text);
        const recognizedText = e.result.text;
        if (recognizedText === "小當家。") {
          // dispatch({
          //   type: actionTypes.SET_TEXT_FROM_MIC,
          //   textFromMic: recognizedText,
          // });
          AI_Awake();
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
      recognizer.stopContinuousRecognitionAsync(
        (result) => {
          console.log(result);
        },
        (err) => console.log(err)
      );
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

  // 初始化元件
  useEffect(() => {
    // SpeechRecognition.startListening({ continuous: true, language: "zh-TW" });
    sttFromMic({ mode: "keywordRecognizer" });
    // 一個 modal 初始化時顯示，提供給使用者 是否開啟語音助理
  }, []);

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

  useEffect(() => {
    if (!isAssistantModelOpen) {
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

  // 顯示 AI 回覆 與 說出合成語音
  const displayAndSpeakResponse = async (text) => {
    speak(text);
    dispatch({
      type: actionTypes.SET_AI_RESPONSE,
      AIResponse: text,
    });
  };

  console.log("意圖: ", intentInfo);
  console.log("第二監聽: ", textFromMic);
  //console.log(recipeResult);

  const startListening = () => {
    sttFromMic({ mode: "keywordRecognizer" });
    setIsAllowSTTMicModalOpen();
  };
  const stopListening = async () => {
    sttFromMic({ mode: "stopListening" });
  };
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
