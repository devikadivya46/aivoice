export interface IVoiceService {
  startListening(onResult: (text: string) => void, onError: (err: string) => void): void;
  stopListening(): void;
  speak(text: string, onEnd?: () => void): void;
  speakAnnouncement(text: string, onEnd?: () => void): void;
  playChime(type?: 'alert' | 'reminder' | 'success' | 'wake'): void;
  stopSpeaking(): void;
  isListening: boolean;
  isSpeaking: boolean;
}

class VoiceService implements IVoiceService {
  private recognition: any = null;
  public isListening: boolean = false;
  public isSpeaking: boolean = false;
  private synthesisVoice: SpeechSynthesisVoice | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = false;
          this.recognition.lang = 'en-US';
        } catch (e) {
          console.warn('SpeechRecognition initialization error', e);
        }
      }

      if ('speechSynthesis' in window) {
        const updateVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          // Find a futuristic/natural sounding English voice
          const naturalVoice = voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Google') ||
                v.name.includes('Natural') ||
                v.name.includes('Samantha') ||
                v.name.includes('Daniel') ||
                v.name.includes('Arthur') ||
                v.name.includes('Guy') ||
                v.name.includes('Jenny') ||
                v.name.includes('David'))
          );
          this.synthesisVoice = naturalVoice || voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
        };

        window.speechSynthesis.onvoiceschanged = updateVoices;
        updateVoices();
      }

      // Unlock AudioContext on first user interaction to ensure Web Audio & Speech synthesis are unblocked
      const unlockAudio = () => {
        if (!this.audioContext) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            this.audioContext = new AudioContextClass();
          }
        }
        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
        if ('speechSynthesis' in window && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      };

      window.addEventListener('click', unlockAudio, { once: false, passive: true });
      window.addEventListener('keydown', unlockAudio, { once: false, passive: true });
      window.addEventListener('touchstart', unlockAudio, { once: false, passive: true });
    }
  }

  public playChime(type: 'alert' | 'reminder' | 'success' | 'wake' = 'reminder'): void {
    if (typeof window === 'undefined') return;
    try {
      if (!this.audioContext) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioContext = new AudioContextClass();
        }
      }
      if (!this.audioContext) return;

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      if (type === 'reminder') {
        // Futuristic double pulse chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.12); // A5
        osc.frequency.setValueAtTime(1174.66, now + 0.24); // D6
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'alert') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(659.25, now + 0.15);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'wake') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(783.99, now + 0.1); // G5
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      console.warn('Audio chime playback error:', e);
    }
  }

  public startListening(onResult: (text: string) => void, onError: (err: string) => void): void {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser. You can type in the prompt box.');
      return;
    }

    try {
      this.playChime('wake');
      this.isListening = true;
      this.recognition.onresult = (event: any) => {
        this.isListening = false;
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onResult(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError(event.error || 'Voice input stopped.');
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      onError(err.message || 'Microphone access denied or busy.');
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    this.isListening = false;
  }

  public speak(text: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Clean markdown, brackets, emojis, code blocks, or special characters
      const cleanText = text
        .replace(/```[\s\S]*?```/g, 'Code block omitted.')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[*_#~]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/https?:\/\/\S+/g, 'link')
        .replace(/[^\w\s.,!?'"–—:;()-]/g, '')
        .trim();

      if (!cleanText) {
        if (onEnd) onEnd();
        return;
      }

      this.isSpeaking = true;

      // Chrome SpeechSynthesis bug workaround: resume if paused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (this.synthesisVoice) {
        utterance.voice = this.synthesisVoice;
      }
      utterance.pitch = 0.96;
      utterance.rate = 1.04;
      utterance.volume = 1.0;

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (err) => {
        console.warn('SpeechSynthesis error:', err);
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  public speakAnnouncement(text: string, onEnd?: () => void): void {
    this.playChime('reminder');
    setTimeout(() => {
      this.speak(text, onEnd);
    }, 350);
  }

  public stopSpeaking(): void {
    this.isSpeaking = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const voiceService = new VoiceService();
