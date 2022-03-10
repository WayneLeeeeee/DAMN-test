import * as sdk from "microsoft-cognitiveservices-speech-sdk";
const DEFAULT_SPEECH_CONFIG = {
  language: "zh-CN",
  voiceName: "zh-CN-XiaoxiaoNeural",
};

const speak = (text, config = DEFAULT_SPEECH_CONFIG) => {
  if (typeof window === "undefined") return;

  console.log(process.env.AZURE_REGION);
  let speechConfig = sdk.SpeechConfig.fromSubscription(
    "597a30b28d9a46618332e246cdd53dc4",
    "eastasia"
  );
  // Note: if only language is set, the default voice of that language is chosen.
  speechConfig.speechSynthesisLanguage = config.language; // For example, "de-DE"
  // The voice setting will overwrite the language setting.
  // The voice setting will not overwrite the voice element in input SSML.
  speechConfig.speechSynthesisVoiceName = config.voiceName;
  console.log(speechConfig);
  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
  synthesizer.speakSsmlAsync(
    ` <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-CN">
        <voice name="zh-CN-XiaoxiaoNeural">
            <mstts:express-as style="gentle">
                ${text}
            </mstts:express-as>
        </voice>
    </speak>`,
    (result) => {
      if (result) {
        synthesizer.close();
        //console.log(result.audioData);
        return result.audioData;
      }
    },
    (error) => {
      console.log(error);
      synthesizer.close();
    }
  );
  //   synthesizer.speakTextAsync(
  //     text,
  //     (result) => {
  //       if (result) {
  //         synthesizer.close();
  //         //console.log(result.audioData);
  //         return result.audioData;
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //       synthesizer.close();
  //     }
  //   );
};

export default speak;
