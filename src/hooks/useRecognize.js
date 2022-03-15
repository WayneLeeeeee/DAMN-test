import { useState, useEffect, useRef, useCallback } from "react";
import SpeechRecognition from "react-speech-recognition";
// import { sify } from "chinese-conv";
const useRecognize = (text, commands = []) => {
  // text = "推薦一些小黃瓜料理給我";
  console.log("text: ", text);
  const [topIntent, setTopIntent] = useState("");
  const [intentInfo, setIntentInfo] = useState(null);
  const commandsRef = useRef(commands);
  commandsRef.current = commands;
  //console.log(" commandsRef.current : ", commandsRef.current);

  useEffect(() => {
    if (!text) return "no text";
    recognizeIntent(text);
  }, [text]);

  useEffect(() => {
    console.log(intentInfo);
    const entities = intentInfo?.prediction.entities;
    matchCommands(entities);
  }, [intentInfo]);

  const recognizeIntent = async (text) => {
    if (!text) return;
    const response = await fetch(
      `https://damn.cognitiveservices.azure.com/luis/prediction/v3.0/apps/81aad6d8-176f-4f9b-81f7-dcf711b02a38/slots/production/predict?verbose=true&show-all-intents=true&log=true&subscription-key=597a30b28d9a46618332e246cdd53dc4&query=${text}`
    );
    console.log("recognize Intent");
    const temp_data = await response.json();
    //console.log("top: ", temp_data.prediction.topIntent);
    setTopIntent(temp_data.prediction.topIntent);
    setIntentInfo(temp_data);
    // return temp_data;
  };

  const matchCommands = async (entities) => {
    commandsRef.current.forEach(({ intent, callback }) => {
      if (topIntent === intent) {
        callback(entities);
        SpeechRecognition.startListening({
          continuous: true,
          language: "zh-TW",
        });
        return;
      }
    });
  };

  const clearIntent = () => {
    setTopIntent("");
    setIntentInfo(null);
  };

  return [intentInfo, topIntent, clearIntent];
};

export default useRecognize;
