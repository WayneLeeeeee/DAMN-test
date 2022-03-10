import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Backdrop, Dialog, Slide } from "@mui/material";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { debounce, isArray } from "lodash";
import speak from "../function/speak";
import useRecognize from "../hooks/useRecognize";
import getTokenOrRefresh from "../function/getTokenOrRefresh";
import useSound from "use-sound";
import sound from "../public/sound/sound.mp3";
import useSearch from "../hooks/useSearch";
// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

const Assistant = () => {
  const [playSound] = useSound(sound);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // need to set global state
  const [displayText, setDisplayText] = useState("");
  const [AIResponse, setAIResponse] = useState("");
  const [recipeQuery, setRecipeQuery] = useState("");
  const recipes = useSearch("recipes", recipeQuery);

  // 命令 stt => speech to text
  let STT_Commands = [
    {
      intent: "Recipe.Search",
      callback: async (entities) => {
        const foods = entities.Foods;

        if (foods?.length <= 0 || !isArray(foods)) {
          displayAndSpeakResponse("沒有找到符合需求的項目");
          return;
        }

        // console.log(foods[0]?.text);
        setRecipeQuery(foods[0]);
        //await displayAndSpeakResponse(`為您搜尋 ${foods[0].text}中`);
        console.log("recipeQuery is: ", recipeQuery);
        console.log("search recipes is: ", recipes);
        // ...
        recipes &&
          displayAndSpeakResponse(
            `幫您找到 ${recipes.length} 個關於  ${foods[0]} 的項目`
          );
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

  // 延遲 提示音
  const delayPlaySound = debounce(() => {
    playSound();
  }, 1200);

  // 延遲 命令辨識
  const delaySTTFromMic = debounce(async () => {
    // 延遲 1.8 秒，開啟命令用語音
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
  const handleDialogOpen = () => setIsDialogOpen(true ? false : true);

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

  console.log("第一監聽: ", finalTranscript.split(" ").pop());
  console.log("意圖: ", intentInfo);
  console.log("第二監聽: ", displayText);

  // 顯示 AI 回覆 與 說出合成語音
  const displayAndSpeakResponse = async (text) => {
    speak(text);
    setAIResponse(text);
  };

  return (
    <>
      <button onClick={() => sttFromMic()}>click</button>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
        }}
        open={isDialogOpen}
        onClick={handleDialogOpen}
      >
        <p className="color-text">{transcript.split(" ").pop()}</p>
        <p className="color-primary">{AIResponse}</p>

        {/* {recipes?.map((recipe, index) => (
          <RecipeCard recipe={recipe} key={recipe.objectID} index={index} />
        ))} */}
      </Backdrop>
    </>
  );
};

export default Assistant;
