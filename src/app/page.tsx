import Image from "next/image";
import VoiceBankingAssistant from "./components/VoiceAssistant"
import Conversation from "./components/ElevenLabs"

export default function Home() {
  return (
    <>
      <VoiceBankingAssistant />
      <Conversation />
    </>
  );
}
