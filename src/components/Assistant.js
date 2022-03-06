import React, { useEffect, useState } from "react";
// import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Dialog, Slide } from "@mui/material";
import handleSpeak from "../function/handleSpeak";
import image from "../images/animation.gif";
// const appId = "8b461380-b198-4740-b55b-3b1456820091";
// const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Assistant = () => {
  const [assistantResponse, setAssistantResponse] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // need to set global state
  const commands = [
    {
      command: ["小當家"],
      callback: () => {
        handleSpeakAndResponse("什麼事？");
        setIsDialogOpen(true);
      },
      isFuzzyMatch: true, // 模糊匹配
      bestMatchOnly: true,
    },
    {
      command: ["關閉", "關掉", "沒你的事"],
      callback: () => {
        if (isDialogOpen) {
          setIsDialogOpen(false);
        }
      },
      matchInterim: true,
    },
    {
      command: ["搜尋"],
      callback: () => {
        console.log("ss", finalTranscript.split(" ").pop());
        fetch("http://localhost:3000/api/hello", {
          mode: "no-cors",
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            console.log(res);
            return res;
          })
          .then((data) => {
            console.log(data);
          });
      },
      isFuzzyMatch: true, // 模糊匹配
      bestMatchOnly: true,
      matchInterim: true,
    },
    {
      command: ["停止監聽"],
      callback: () => {
        if (isDialogOpen) {
          SpeechRecognition.stopListening();
          setIsDialogOpen(false);
        }
      },
      isFuzzyMatch: true, // 模糊匹配

      bestMatchOnly: true,
    },
  ];

  const {
    transcript,
    // listening,
    // resetTranscript,
    finalTranscript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening,
    isMicrophoneAvailable,
  } = useSpeechRecognition({ commands });

  // console.log(transcript.split(" ").pop());
  console.log("finalTranscript: ", finalTranscript.split(" ").pop());
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      return <span>Oops!! 瀏覽器不支援</span>;
    }
    if (!isMicrophoneAvailable) {
      return <span>回上一頁</span>;
    }
    if (browserSupportsContinuousListening) {
      // polyfill 只能聽英文 ...
      // SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);
      SpeechRecognition.startListening({ continuous: true, language: "zh-TW" });
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "zh-TW" });
    }
  }, []);

  const handleDialogOpen = () => setIsDialogOpen(true ? false : true);

  const handleSpeakAndResponse = (phrase) => {
    handleSpeak(phrase);
    setAssistantResponse(phrase);
    return;
  };

  return (
    <>
      <Dialog
        onClose={handleDialogOpen}
        open={isDialogOpen}
        // open={true}
        fullWidth
        onBackdropClick={handleDialogOpen}
        TransitionComponent={Transition}
      >
        {/* <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button> */}

        <p className="color-text">{transcript.split(" ").pop()}</p>
        <p className="color-primary">{assistantResponse}</p>
        {/* <TextToSpeech text={transcript} /> */}
        <img className="voice-recognition" src={image} alt="..." />
      </Dialog>
    </>
  );
};

export default Assistant;
