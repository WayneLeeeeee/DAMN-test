import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Backdrop,
  Dialog,
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
import { debounce, isArray } from "lodash";
import speak from "../function/speak";
import useRecognize from "../hooks/useRecognize";
import getTokenOrRefresh from "../function/getTokenOrRefresh";
import useSound from "use-sound";
import sound from "../public/sound/sound.mp3";
import useSearch from "../hooks/useSearch";
import algoliaSearch from "../function/algoliaSearch";
import RecipeCard from "../components/recipe/RecipeCard";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

const Assistant = () => {
  const [playSound] = useSound(sound);
  const [isDialogOpen, setIsDialogOpen] = useState(true); // need to set global state
  const [displayText, setDisplayText] = useState("");
  const [AIResponse, setAIResponse] = useState("");
  const [recipeResult, setRecipeResult] = useState(null);
  // 命令 stt => speech to text
  let STT_Commands = [
    {
      intent: "Recipe.Search",
      callback: (entities) => {
        handleRecipeSearch(entities);
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
    displayText,
    STT_Commands
  );

  // 關鍵字喚醒 commands
  let commands = [
    {
      command: ["小當家"],
      callback: () => {
        clearIntent();
        displayAndSpeakResponse("我在");
        setIsDialogOpen(true);
        delayPlaySound();
        delaySTTFromMic();
      },
      isFuzzyMatch: true, // 模糊匹配
      bestMatchOnly: true,
    },
  ];

  // 執行 RecipeSearch 意圖
  const handleRecipeSearch = async (entities) => {
    const foods = entities.Foods;
    const recipe = entities.Recipe;
    const result = await algoliaSearch("recipes", foods[0][0]);
    if (foods?.length < 0 || !isArray(foods) || result?.length <= 0) {
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

  // 延遲 提示音
  const delayPlaySound = debounce(() => {
    playSound();
  }, 1200);

  // 延遲 命令辨識
  const delaySTTFromMic = debounce(async () => {
    // 延遲 2 秒，開啟命令用語音
    // 因為語音辨識會把 “我在“ 一起錄進去
    // 兩秒後應該要有 提示音
    sttFromMic();
  }, 2000);

  const {
    transcript,
    // listening,
    // resetTranscript,
    finalTranscript,
    browserSupportsSpeechRecognition,
    //browserSupportsContinuousListening,
    isMicrophoneAvailable,
  } = useSpeechRecognition({ commands });

  // 初始化
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      return <span>Oops!! 瀏覽器不支援</span>;
    }
    if (!isMicrophoneAvailable) {
      return <span>回上一頁</span>;
    }

    SpeechRecognition.startListening({ continuous: true, language: "zh-TW" });
  }, []);

  // 小當家彈出視窗 開關
  const handleDialogOpen = () => {
    setIsDialogOpen(true ? false : true);
    setRecipeResult(null);
    setAIResponse("");
    setDisplayText("");
  };

  // 命令用語音 stt => speech to text
  const sttFromMic = async () => {
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
    setDisplayText("");

    const text = recognizer.recognizeOnceAsync((result) => {
      let displayText;
      // console.log(result.text);
      if (result.reason === ResultReason.RecognizedSpeech) {
        //displayText = `RECOGNIZED: Text=${result.text}`;
        setDisplayText(result.text);
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }
      //setDisplayText(result.text);
      return result.text;
    });

    return text;
  };

  // 顯示 AI 回覆 與 說出合成語音
  const displayAndSpeakResponse = async (text) => {
    speak(text);
    setAIResponse(text);
  };

  // const useStyles = makeStyles((theme) => ({
  //   backDrop: {
  //     backdropFilter: "blur(10px)",
  //     backgroundColor: "rgba(0,0,30,0.4)",
  //     color: "#fff",
  //     zIndex: 1,
  //   },
  // }));
  // const styles = useStyles();
  console.log("第一監聽: ", finalTranscript.split(" ").pop());
  console.log("意圖: ", intentInfo);
  console.log("第二監聽: ", displayText);
  console.log(recipeResult);
  return (
    <div>
      <Dialog
        open={isDialogOpen}
        sx={{
          backdropFilter: "blur(10px)",
          //other styles here
        }}
      >
        {recipeResult?.map((recipe) => (
          <RecipeCard recipeData={recipe} />
        ))}
      </Dialog>

      <Dialog
        fullWidth
        open={isDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={isDialogOpen}
        aria-describedby="alert-dialog-slide-description"
        backdropComponent={{ display: "none" }}
        // sx={{
        //   backdropFilter: "blur(10px)",
        //   //other styles here
        // }}
      >
        <DialogTitle sx={{ color: "#fff" }}>
          {transcript.split(" ").pop()}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ color: "rgb(254, 139, 131)" }}>
            {AIResponse}
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assistant;
