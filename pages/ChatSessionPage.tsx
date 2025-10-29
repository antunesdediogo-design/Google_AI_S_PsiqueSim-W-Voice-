import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PatientId, Message } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ai, getPatientBriefing, getPatientSystemInstruction } from '../services/geminiService';
import { patients } from '../constants';
import type { Chat, LiveSession, LiveServerMessage, Blob } from '@google/genai';
import { Modality } from '@google/genai';
import MicrophoneIcon from '../components/icons/MicrophoneIcon';
import StopIcon from '../components/icons/StopIcon';
import SendIcon from '../components/icons/SendIcon';

// Helper functions for audio processing, kept in-component for simplicity
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


interface ChatHeaderProps {
    patientId: PatientId;
    onEndSession: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ patientId, onEndSession }) => {
    const { t } = useLanguage();
    const headerKey = patientId === 'TomasPerez' ? 'chat.headerTomas' : 'chat.headerAntonia';
    return (
        <header className="bg-dark-navy text-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">{t(headerKey)}</h1>
            <button
                onClick={onEndSession}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
                {t('chat.endSession')}
            </button>
        </header>
    );
};

type SessionStatus = 'idle' | 'connecting' | 'active' | 'error';


const ChatSessionPage: React.FC<{ patientId: PatientId; onEndSession: () => void; }> = ({ patientId, onEndSession }) => {
  const { t } = useLanguage();
  const [briefing, setBriefing] = useState('');
  const [status, setStatus] = useState<SessionStatus>('idle');
  
  const [conversation, setConversation] = useState<Omit<Message, 'id'>[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');

  // Refs for audio and session management
  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const currentInputRef = useRef('');
  const currentOutputRef = useRef('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);

  useEffect(() => {
    setBriefing(getPatientBriefing(patientId));
    
    const systemInstruction = getPatientSystemInstruction(patientId);
    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
    });

    return () => {
      endVoiceSession();
    };
  }, [patientId]);
  
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
        const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        userScrolledUpRef.current = !isAtBottom;
    }
  };

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (!userScrolledUpRef.current) {
        scrollToBottom();
    }
  }, [conversation, currentInput, currentOutput, isThinking, scrollToBottom]);


  const endVoiceSession = useCallback(() => {
    setStatus('idle');
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
        sessionPromiseRef.current = null;
    }
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
        inputAudioContextRef.current.close().catch(console.error);
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
         outputAudioContextRef.current.close().catch(console.error);
    }
    audioSourcesRef.current.forEach(source => source.stop());
    audioSourcesRef.current.clear();
  }, []);

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isThinking || status !== 'idle') return;

    const userMessage = textInput;
    setTextInput('');
    setConversation(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsThinking(true);

    try {
      const response = await chatRef.current?.sendMessage({ message: userMessage });
      if (response) {
        setConversation(prev => [...prev, { sender: 'ai', text: response.text }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setConversation(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error." }]);
    } finally {
      setIsThinking(false);
    }
  };

  const startVoiceSession = async () => {
    setStatus('connecting');
    currentInputRef.current = '';
    currentOutputRef.current = '';

    try {
        const patient = patients.find(p => p.id === patientId);
        if (!patient) {
            console.error("Patient not found for ID:", patientId);
            setStatus('error');
            return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        nextStartTimeRef.current = 0;
        
        sessionPromiseRef.current = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    setStatus('active');
                    const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                    const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;

                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromiseRef.current?.then((session) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContextRef.current!.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (message.serverContent?.inputTranscription) {
                        const text = message.serverContent.inputTranscription.text;
                        setCurrentInput(prev => prev + text);
                        currentInputRef.current += text;
                    }
                    if (message.serverContent?.outputTranscription) {
                        const text = message.serverContent.outputTranscription.text;
                        setCurrentOutput(prev => prev + text);
                        currentOutputRef.current += text;
                    }
                    if (message.serverContent?.turnComplete) {
                        const finalUserInput = currentInputRef.current.trim();
                        const finalAiOutput = currentOutputRef.current.trim();

                        setConversation(prev => {
                            const newHistory = [...prev];
                            if (finalUserInput) newHistory.push({ sender: 'user', text: finalUserInput });
                            if (finalAiOutput) newHistory.push({ sender: 'ai', text: finalAiOutput });
                            return newHistory;
                        });

                        setCurrentInput('');
                        setCurrentOutput('');
                        currentInputRef.current = '';
                        currentOutputRef.current = '';
                    }
                    
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (base64Audio) {
                        const audioCtx = outputAudioContextRef.current!;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
                        
                        const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
                        const source = audioCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(audioCtx.destination);
                        
                        source.addEventListener('ended', () => {
                            audioSourcesRef.current.delete(source);
                        });

                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        audioSourcesRef.current.add(source);
                    }
                     const interrupted = message.serverContent?.interrupted;
                      if (interrupted) {
                        for (const source of audioSourcesRef.current.values()) {
                          source.stop();
                          audioSourcesRef.current.delete(source);
                        }
                        nextStartTimeRef.current = 0;
                      }
                },
                onerror: (e: ErrorEvent) => {
                    console.error('Session error:', e);
                    setStatus('error');
                    endVoiceSession();
                },
                onclose: () => {
                    // Session closed by server or manually
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: patient.voiceName }}},
                systemInstruction: getPatientSystemInstruction(patientId),
                inputAudioTranscription: {},
                outputAudioTranscription: {},
            },
        });

    } catch (error) {
        console.error('Failed to start voice session:', error);
        setStatus('error');
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      <ChatHeader patientId={patientId} onEndSession={onEndSession} />
      
      <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="bg-white text-dark-navy shadow p-4 rounded-lg">
           <h2 className="text-lg font-bold mb-2">Session Briefing</h2>
           <p className="whitespace-pre-wrap">{briefing}</p>
        </div>
        
        {conversation.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-lg lg:max-w-2xl px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-accent-orange text-white' : 'bg-white text-dark-navy shadow'}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
            </div>
        ))}

        {currentInput && (
            <div className="flex justify-end">
                <div className="max-w-lg lg:max-w-2xl px-4 py-3 rounded-2xl bg-accent-orange text-white opacity-70">
                    <p className="whitespace-pre-wrap">{currentInput}</p>
                </div>
            </div>
        )}
        {currentOutput && (
            <div className="flex justify-start">
                <div className="max-w-lg lg:max-w-2xl px-4 py-3 rounded-2xl bg-white text-dark-navy shadow opacity-70">
                   <p className="whitespace-pre-wrap">{currentOutput}</p>
                </div>
            </div>
        )}

        {isThinking && (
             <div className="flex justify-start">
                <div className="max-w-lg lg:max-w-2xl px-4 py-3 rounded-2xl bg-white text-dark-navy shadow opacity-70">
                   <p className="whitespace-pre-wrap italic">{t(patientId === 'TomasPerez' ? 'chat.loadingTomas' : 'chat.loadingAntonia')}</p>
                </div>
            </div>
        )}
      </div>
      
      <div className="bg-white border-t p-4 shrink-0">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-2">
                <button
                    onClick={status === 'active' ? endVoiceSession : startVoiceSession}
                    disabled={status === 'connecting' || isThinking}
                    className="bg-soft-blue text-dark-navy rounded-full p-3 hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center shadow-sm"
                 >
                    {status === 'active' ? <StopIcon className="w-6 h-6"/> : <MicrophoneIcon className="w-6 h-6"/>}
                 </button>

                 <form onSubmit={handleSendText} className="flex-grow flex items-center">
                    <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={status === 'active' ? 'Voice session in progress...' : t('chat.inputPlaceholder')}
                        disabled={status !== 'idle' || isThinking}
                        className="w-full border border-gray-300 rounded-full py-3 px-5 focus:ring-2 focus:ring-soft-blue focus:outline-none disabled:bg-gray-100"
                    />
                    <button
                        type="submit"
                        disabled={status !== 'idle' || isThinking || !textInput.trim()}
                        className="ml-2 bg-accent-orange text-white rounded-full p-3 hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center shadow-sm"
                    >
                        <SendIcon className="w-6 h-6" />
                    </button>
                 </form>
            </div>
             <p className="text-xs text-center text-gray-500 font-medium mt-2">
                {status === 'idle' && (isThinking ? 'Patient is thinking...' : 'Click the microphone to start a voice session or type a message.')}
                {status === 'connecting' && 'Connecting voice session...'}
                {status === 'active' && 'Voice session active. Click the stop button to end.'}
                {status === 'error' && 'Connection error. Please try again.'}
            </p>
        </div>
      </div>
    </div>
  );
};

export default ChatSessionPage;