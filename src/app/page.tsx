"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { translationQualityScore, TranslationQualityScoreOutput } from "@/ai/flows/translation-quality-score";
import { realtimeTranslation } from "@/ai/flows/realtime-translation-flow";
import { useToast } from "@/hooks/use-toast";

import { useForm } from "react-hook-form";
import { Toaster } from "@/components/ui/toaster";

const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'ru', label: 'Russian' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' },
    { value: 'zh-TW', label: 'Chinese (Traditional)' },
    { value: 'ar', label: 'Arabic' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'hi', label: 'Hindi' },
    { value: 'sw', label: 'Swahili' },
    { value: 'nl', label: 'Dutch' },
    { value: 'pl', label: 'Polish' },
    { value: 'tr', label: 'Turkish' },
    { value: 'vi', label: 'Vietnamese' },
    { value: 'id', label: 'Indonesian' },
    { value: 'th', label: 'Thai' },
    { value: 'ms', label: 'Malay' },
    { value: 'fil', label: 'Filipino' },
    { value: 'uk', label: 'Ukrainian' },
    { value: 'el', label: 'Greek' },
    { value: 'ro', label: 'Romanian' },
    { value: 'cs', label: 'Czech' },
    { value: 'hu', label: 'Hungarian' },
    { value: 'sv', label: 'Swedish' },
    { value: 'da', label: 'Danish' },
    { value: 'fi', label: 'Finnish' },
    { value: 'no', label: 'Norwegian' },
    { value: 'he', label: 'Hebrew' },
    { value: 'fa', label: 'Persian' },
    { value: 'bn', label: 'Bengali' },
    { value: 'ur', label: 'Urdu' },
    { value: 'hr', label: 'Croatian' },
    { value: 'sk', label: 'Slovak' },
    { value: 'bg', label: 'Bulgarian' },
    { value: 'sr', label: 'Serbian' },
    { value: 'sl', label: 'Slovenian' },
    { value: 'lt', label: 'Lithuanian' },
    { value: 'lv', label: 'Latvian' },
    { value: 'et', label: 'Estonian' },
    { value: 'is', label: 'Icelandic' },
    { value: 'ga', label: 'Irish' },
    { value: 'cy', label: 'Welsh' },
    { value: 'sq', label: 'Albanian' },
    { value: 'mt', label: 'Maltese' },
    { value: 'mk', label: 'Macedonian' },
    { value: 'az', label: 'Azerbaijani' },
    { value: 'ka', label: 'Georgian' },
    { value: 'hy', label: 'Armenian' },
    { value: 'kk', label: 'Kazakh' },
    { value: 'ky', label: 'Kyrgyz' },
    { value: 'uz', label: 'Uzbek' },
    { value: 'tg', label: 'Tajik' },
    { value: 'tm', label: 'Turkmen' },
    { value: 'mn', label: 'Mongolian' },
    { value: 'km', label: 'Khmer' },
    { value: 'lo', label: 'Lao' },
    { value: 'my', label: 'Burmese' },
    { value: 'ne', label: 'Nepali' },
    { value: 'si', label: 'Sinhala' },
    { value: 'am', label: 'Amharic' },
    { value: 'so', label: 'Somali' },
    { value: 'zu', label: 'Zulu' },
    { value: 'xh', label: 'Xhosa' },
    { value: 'jw', label: 'Javanese' },
    { value: 'yi', label: 'Yiddish' },
    { value: 'te', label: 'Telugu' },
    { value: 'ta', label: 'Tamil' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'kn', label: 'Kannada' },
    { value: 'mr', label: 'Marathi' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'pa', label: 'Punjabi' },
    { value: 'or', label: 'Odia' },
    { value: 'as', label: 'Assamese' },
    { value: 'bh', label: 'Bhojpuri' },
    { value: 'mg', label: 'Malagasy' },
    { value: 'dv', label: 'Divehi' },
    { value: 'ti', label: 'Tigrinya' },
    { value: 'rn', label: 'Rundi' },
    { value: 'rw', label: 'Kinyarwanda' },
    { value: 'lb', label: 'Luxembourgish' },
    { value: 'iu', label: 'Inuktitut' },
    { value: 'gl', label: 'Galician' },
    { value: 'eu', label: 'Basque' },
    { value: 'ca', label: 'Catalan' },
    { value: 'gd', label: 'Scottish Gaelic' },
    { value: 'kw', label: 'Cornish' },
    { value: 'br', label: 'Breton' },
    { value: 'vo', label: 'Volapük' },
    { value: 'wa', label: 'Walloon' },
    { value: 'co', label: 'Corsican' },
    { value: 'frr', label: 'Northern Frisian' },
    { value: 'st', label: 'Southern Sotho' },
    { value: 'tn', label: 'Tswana' },
    { value: 'ss', label: 'Swati' },
    { value: 'ts', label: 'Tsonga' },
    { value: 've', label: 'Venda' },
    { value: 'nr', label: 'Southern Ndebele' },
];

export default function Home() {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [qualityScore, setQualityScore] = useState<TranslationQualityScoreOutput | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [sourceLanguage, setSourceLanguage] = useState('en');
    const [targetLanguage, setTargetLanguage] = useState('es');
    const { toast } = useToast();
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const { register, handleSubmit, setValue } = useForm();

    const translate = async (text: string) => {
        if (text) {
            try {
                const translated = await realtimeTranslation({
                    sourceText: text,
                    sourceLanguage: sourceLanguage,
                    targetLanguage: targetLanguage,
                });
                setTranslatedText(translated.translatedText);

                const score = await translationQualityScore({
                    originalText: text,
                    translatedText: translated.translatedText,
                    sourceLanguage: sourceLanguage,
                    targetLanguage: targetLanguage,
                });
                setQualityScore(score);
                speak(translated.translatedText, targetLanguage);
            } catch (error: any) {
                console.error("Error during translation:", error);
                toast({
                    title: "Error",
                    description: "Failed to translate text.",
                    variant: "destructive",
                });
            }
        }
    };

    const speak = (text: string, language: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        speechSynthesis.speak(utterance);
    };


    const handleVoiceControl = () => {
        if (!recognitionRef.current) {
            // Check if SpeechRecognition is supported
            if (!('webkitSpeechRecognition' in window)) {
                toast({
                    title: "Error",
                    description: "Speech recognition is not supported in this browser. Please use Chrome.",
                    variant: "destructive",
                });
                return;
            }
            recognitionRef.current = new webkitSpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = sourceLanguage;

            recognitionRef.current.onstart = () => {
                setIsRecording(true);
                toast({
                    title: "Recording...",
                    description: "Speak now. Real-time transcription is active.",
                });
            };

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscripts = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        setInputText(prev => prev + transcript + ' ');
                        setValue("text", inputText + transcript + ' ');
                        translate(inputText + transcript + ' ');
                    } else {
                        interimTranscripts += transcript;
                    }
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                toast({
                    title: "Error",
                    description: `Speech recognition error: ${event.error}`,
                    variant: "destructive",
                });
                stopRecording();
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
                toast({
                    title: "Stopped Recording",
                    description: "Speech recognition has ended.",
                });
            };

            recognitionRef.current.start();
        } else {
            stopRecording();
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
            setIsRecording(false);
        }
    };


    const onSubmit = async (data: any) => {
        setInputText(data.text);
        await translate(data.text);
    };

    useEffect(() => {
        if (inputText) {
            setValue("text", inputText);
        }
    }, [inputText, setValue]);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = sourceLanguage; // Update language on sourceLanguage change
        }
    }, [sourceLanguage]);


    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4">
            <Toaster />
            <h1 className="text-2xl font-bold mb-4">LinguaLive</h1>

            <div className="flex space-x-4 mb-4">
                <div>
                    <Label htmlFor="sourceLanguage">Source Language</Label>
                    <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                        <SelectTrigger id="sourceLanguage">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                    {lang.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="targetLanguage">Target Language</Label>
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                        <SelectTrigger id="targetLanguage">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                    {lang.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 w-full max-w-2xl">
                <div>
                    <Label htmlFor="text">Input Text</Label>
                    <Textarea
                        id="text"
                        placeholder="Enter text to translate"
                        className="min-h-[100px]"
                        {...register("text")}
                    />
                </div>
                <Button type="submit" variant="secondary">Translate</Button>
            </form>

            <Button onClick={handleVoiceControl} className="mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>

            {translatedText && (
                <Card className="w-full max-w-2xl mt-8">
                    <CardHeader>
                        <CardTitle>Translated Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{translatedText}</p>
                    </CardContent>
                </Card>
            )}

            {qualityScore && (
                <Card className="w-full max-w-2xl mt-4">
                    <CardHeader>
                        <CardTitle>Translation Quality Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Quality: {qualityScore.qualityScore}</p>
                        <p>Explanation: {qualityScore.explanation}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
