import { useState, useEffect, useRef, useCallback, useLayoutEffect, FC } from "react";
import TerminalHeader from "./TerminalHeader";
import EmailForm from "./EmailForm";
import { executeCommand, type OutputLine } from "@/lib/terminalCommands";

const BOOT_LINES = [
  "Copyright 2021 Terry Enterprise ↈ. All rights reserved.",
  "ACCESS SYSTEM: AIDEN TERRY",
  "PORTFOLIO TERMINAL v2.0",
  "SESSION STATUS: AUTHORIZED",
  "SECURITY LAYER: ACTIVE",
  "TRACE MODE: OFF",
  "",
  "INITIALIZING INTERFACE...",
  "CHECKING SYSTEM HEALTH... OK",
  "LOADING PROFILE DATA... OK",
  "LOADING PROJECT RECORDS... OK",
  "LOADING EXPERIENCE LOGS... OK",
  "LOADING CONTACT CHANNELS... OK",
  "LOADING CREDENTIALS... OK",
  "FINALIZING BOOT SEQUENCE... OK",
  "",
];

type Phase = "boot" | "shell";
type RenderLine = OutputLine & { typedText?: string };

const AVAILABLE_COMMANDS = ["personnel", "projects", "records", "comms", "skills", "awards", "college", "startups", "now", "timeline", "theme", "email", "resume", "help", "clear"];

const TerminalScreen: FC = () => {
  const [phase, setPhase] = useState<Phase>("boot");
  const [bootIndex, setBootIndex] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [renderLines, setRenderLines] = useState<RenderLine[]>([]);
  const [typingQueue, setTypingQueue] = useState<OutputLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTypingIndex, setActiveTypingIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [cursorLeft, setCursorLeft] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copyToast, setCopyToast] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [theme, setTheme] = useState<string>("green");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const typingIntervalRef = useRef<number | null>(null);
  const typingIndexRef = useRef<number | null>(null);
  const typingLineRef = useRef<OutputLine | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioEnabledRef = useRef(false);
  const lastSoundTimeRef = useRef(0);

  // Boot sequence
  useEffect(() => {
    if (phase !== "boot") return;
    if (bootIndex < BOOT_LINES.length) {
      const t = setTimeout(() => setBootIndex((i) => i + 1), 120);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowPrompt(true), 300);
      return () => clearTimeout(t);
    }
  }, [phase, bootIndex]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [renderLines, bootIndex]);

  // Focus input when shell active
  useEffect(() => {
    if (phase === "shell") inputRef.current?.focus();
  }, [phase, renderLines]);

  // Focus container when boot prompt is ready so Enter works without click
  useEffect(() => {
    if (phase === "boot" && showPrompt) {
      containerRef.current?.focus();
    }
  }, [phase, showPrompt]);

  // Keep block cursor aligned with actual text width
  useLayoutEffect(() => {
    if (!mirrorRef.current) return;
    setCursorLeft(mirrorRef.current.offsetWidth);
  }, [inputValue]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current !== null) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const initAudio = useCallback(() => {
    if (audioEnabledRef.current) return;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    audioContextRef.current = new AudioCtx();
    audioEnabledRef.current = true;
  }, []);

  const playTypeSound = useCallback(() => {
    if (!audioEnabledRef.current) return;
    const ctx = audioContextRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    if (now - lastSoundTimeRef.current < 0.025) return;
    lastSoundTimeRef.current = now;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(650, now);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }, []);

  useEffect(() => {
    const enable = () => initAudio();
    window.addEventListener("pointerdown", enable, { once: true });
    window.addEventListener("keydown", enable, { once: true });
    return () => {
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
    };
  }, [initAudio]);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setTheme(customEvent.detail);
    };
    window.addEventListener("themeChange", handleThemeChange);
    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  const enqueueLines = useCallback((lines: OutputLine[]) => {
    setTypingQueue((prev) => [...prev, ...lines]);
  }, []);

  const finalizeTypingLine = useCallback(() => {
    const currentLine = typingLineRef.current;
    if (!currentLine) return;
    if (typingIntervalRef.current !== null) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setRenderLines((prev) => {
      const idx = typingIndexRef.current;
      if (idx === null || idx >= prev.length) return prev;
      const updated = [...prev];
      const line = updated[idx];
      updated[idx] = { ...line, typedText: currentLine.text };
      return updated;
    });
    typingIndexRef.current = null;
    typingLineRef.current = null;
    setIsTyping(false);
    setActiveTypingIndex(null);
  }, []);

  useEffect(() => {
    if (isTyping) return;
    if (typingQueue.length === 0) return;

    const [nextLine, ...rest] = typingQueue;
    setTypingQueue(rest);

    if (!nextLine.text) {
      setRenderLines((prev) => [...prev, nextLine]);
      return;
    }

    // Instant display for very long lines or if queue is backed up
    const textLength = nextLine.text.length;
    const queueLength = typingQueue.length;
    
    if (textLength > 150 || queueLength > 20) {
      setRenderLines((prev) => [...prev, { ...nextLine, typedText: nextLine.text }]);
      return;
    }

    setIsTyping(true);
    let i = 0;
    let index = -1;
    setRenderLines((prev) => {
      index = prev.length;
      typingIndexRef.current = index;
      typingLineRef.current = nextLine;
      setActiveTypingIndex(index);
      return [...prev, { ...nextLine, typedText: "" }];
    });

    // Adjust typing speed based on text length and queue
    const typingSpeed = textLength > 80 ? 1 : queueLength > 10 ? 2 : 4;

    typingIntervalRef.current = window.setInterval(() => {
      i += 1;
      setRenderLines((prev) => {
        const idx = typingIndexRef.current;
        if (idx === null || idx >= prev.length) return prev;
        const updated = [...prev];
        const current = updated[idx];
        updated[idx] = { ...current, typedText: nextLine.text.slice(0, i) };
        return updated;
      });

      const nextChar = nextLine.text[i - 1];
      if (nextChar && nextChar !== " " && typingSpeed >= 3) {
        playTypeSound();
      }

      if (i >= nextLine.text.length) {
        if (typingIntervalRef.current !== null) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        setRenderLines((prev) => {
          const idx = typingIndexRef.current;
          if (idx === null || idx >= prev.length) return prev;
          const updated = [...prev];
          const current = updated[idx];
          updated[idx] = { ...current, typedText: nextLine.text };
          return updated;
        });
        typingIndexRef.current = null;
        typingLineRef.current = null;
        setIsTyping(false);
        setActiveTypingIndex(null);
      }
    }, typingSpeed);
  }, [isTyping, typingQueue, playTypeSound]);

  const runCommand = useCallback((cmd: string) => {
    if (!cmd.trim()) return;
    
    // Add to command history
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    
    const result = executeCommand(cmd);
    if (result === "clear") {
      if (typingIntervalRef.current !== null) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      typingIndexRef.current = null;
      setIsTyping(false);
      setTypingQueue([]);
      setRenderLines([]);
    } else {
      enqueueLines([{ text: `> ${cmd}` }, ...result]);
    }
    setInputValue("");
  }, [enqueueLines]);

  const enterShell = useCallback(() => {
    setPhase("shell");
    const help = executeCommand("help");
    if (help !== "clear") {
      setRenderLines([]);
      setTypingQueue([]);
      enqueueLines([
        { text: "SYSTEM READY. TYPE 'HELP' FOR AVAILABLE COMMANDS." },
        { text: "" },
        ...help,
      ]);
    }
  }, [enqueueLines]);

  const handleHeaderCommand = (cmd: string) => {
    if (phase === "boot") enterShell();
    runCommand(cmd);
    inputRef.current?.focus();
  };

  return (
    <div className="crt-screen flex flex-col h-screen w-screen bg-background text-foreground font-mono overflow-hidden relative" data-theme={theme}>
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-1000"
        style={{ opacity: phase === "boot" ? 0.3 : 0.12 }}
        aria-hidden="true"
      >
        <div className="text-center watermark-outline leading-none tracking-[0.28em]">
          <div className="text-[clamp(2.5rem,10vw,6.5rem)]">TERRY</div>
          <div className="text-[clamp(2rem,8vw,5rem)]">ↈ</div>
          <div className="text-[clamp(2.5rem,10vw,6.5rem)]">ENTERPRISE</div>
        </div>
      </div>

      <div className="relative z-10">
        <TerminalHeader onCommand={handleHeaderCommand} />
      </div>

      <div
        ref={containerRef}
        className="terminal-scroll relative z-10 flex-1 overflow-y-auto p-4 pr-6 sm:p-6 sm:pr-8 focus:outline-none text-sm leading-relaxed text-glow"
        tabIndex={0}
        onKeyDown={(e) => {
          if (phase === "boot" && e.key === "Enter" && showPrompt) {
            enterShell();
          }
          // Skip typing on any keypress
          if (phase === "shell" && isTyping && e.key !== "Tab") {
            finalizeTypingLine();
          }
        }}
        onClick={() => {
          // Skip typing on click
          if (isTyping) {
            finalizeTypingLine();
          }
          // Clear suggestion
          setSuggestion("");
          inputRef.current?.focus();
        }}
      >
        {phase === "boot" && (
          <div className="space-y-1">
            {BOOT_LINES.slice(0, bootIndex).map((l, i) => (
              <div key={i} className="whitespace-pre">
                {l || "\u00A0"}
              </div>
            ))}
            {showPrompt && (
              <div className="mt-4 animate-pulse text-xs sm:text-sm">
                {">"} PRESS ENTER TO CONTINUE
                <span className="inline-block w-2 sm:w-2.5 h-3 sm:h-4 bg-foreground ml-1 animate-[blink_1s_step-end_infinite]" />
              </div>
            )}
          </div>
        )}

        {phase === "shell" && (
          <div>
            {renderLines.map((line, i) => {
              const displayText =
                line.typedText !== undefined &&
                line.typedText.length < line.text.length &&
                i !== activeTypingIndex
                  ? line.text
                  : line.typedText ?? line.text;
              
              // Handle email form special case
              if (displayText.includes("[EMAIL_FORM]")) {
                return <EmailForm key={i} />;
              }
              
              return (
              <div key={i} className="whitespace-pre-wrap break-all">
                {line.isLink && line.url ? (
                  <div className="group relative inline-block">
                    <a
                      href={line.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-foreground/20 transition-colors"
                      onClick={(e) => {
                        if (line.copyable) {
                          e.preventDefault();
                          navigator.clipboard.writeText(line.copyable);
                          setCopyToast(true);
                          setTimeout(() => setCopyToast(false), 2000);
                        }
                      }}
                    >
                      {displayText}
                    </a>
                    {line.copyable && (
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-terminal-green/60">
                        [CLICK TO COPY]
                      </span>
                    )}
                  </div>
                ) : line.command ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isTyping) {
                        finalizeTypingLine();
                      }
                      runCommand(line.command);
                      inputRef.current?.focus();
                    }}
                    className="text-left w-full hover:bg-foreground/15 transition-colors select-none cursor-pointer"
                  >
                    {displayText}
                  </button>
                ) : (
                  displayText || "\u00A0"
                )}
              </div>
            );
            })}

            {/* Input line */}
            <div className="flex items-center mt-1">
              <span className="mr-1">{">"}</span>
              <div className="relative flex-1">
                <span
                  ref={mirrorRef}
                  className="absolute left-0 top-0 invisible whitespace-pre text-xs sm:text-sm font-mono"
                  aria-hidden="true"
                >
                  {inputValue}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setInputValue(newValue);
                    
                    // Update suggestion as user types
                    if (newValue.trim()) {
                      const input = newValue.toLowerCase().trim();
                      const matches = AVAILABLE_COMMANDS.filter(cmd => cmd.startsWith(input)).sort();
                      if (matches.length > 0 && matches[0] !== newValue) {
                        setSuggestion(matches[0]);
                      } else {
                        setSuggestion("");
                      }
                    } else {
                      setSuggestion("");
                    }
                  }}
                  onKeyDown={(e) => {
                    // Skip typing animation on Escape
                    if (e.key === "Escape" && isTyping) {
                      e.preventDefault();
                      finalizeTypingLine();
                      return;
                    }

                    // Command history navigation
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setSuggestion("");
                      if (commandHistory.length === 0) return;
                      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
                      setHistoryIndex(newIndex);
                      setInputValue(commandHistory[newIndex]);
                      return;
                    }
                    
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setSuggestion("");
                      if (historyIndex === -1) return;
                      const newIndex = historyIndex + 1;
                      if (newIndex >= commandHistory.length) {
                        setHistoryIndex(-1);
                        setInputValue("");
                      } else {
                        setHistoryIndex(newIndex);
                        setInputValue(commandHistory[newIndex]);
                      }
                      return;
                    }

                    // Tab completion - accept suggestion
                    if (e.key === "Tab") {
                      e.preventDefault();
                      if (suggestion) {
                        setInputValue(suggestion);
                        setSuggestion("");
                      }
                      return;
                    }

                    // Clear suggestions on escape
                    if (e.key === "Escape") {
                      setSuggestion("");
                      if (isTyping) {
                        finalizeTypingLine();
                      }
                      return;
                    }

                    if (e.key === "Enter") {
                      e.preventDefault();
                      setSuggestion("");
                      runCommand(inputValue);
                    }
                  }}
                  className="bg-transparent border-none outline-none text-foreground font-mono w-full caret-transparent text-xs sm:text-sm touch-manipulation"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  inputMode="text"
                />
                
                {/* Ghost text suggestion */}
                {suggestion && (
                  <span
                    className="absolute left-0 top-0 text-xs sm:text-sm font-mono text-terminal-green/30 pointer-events-none"
                    aria-hidden="true"
                  >
                    {inputValue}<span>{suggestion.slice(inputValue.length)}</span>
                  </span>
                )}
                
                {/* Block cursor */}
                <span
                  className="absolute top-0 inline-block w-2 sm:w-2.5 h-4 sm:h-5 bg-foreground animate-[blink_1s_step-end_infinite] pointer-events-none"
                  style={{ left: `${cursorLeft}px` }}
                />
              </div>
            </div>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Copy Toast */}
      {copyToast && (
        <div className="fixed top-4 right-4 z-50 bg-terminal-green/20 border border-terminal-green px-4 py-2 text-terminal-green text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-300">
          ✓ COPIED TO CLIPBOARD
        </div>
      )}

      {/* CRT overlays */}
      <div className="crt-scanlines pointer-events-none fixed inset-0 z-50" />
      <div className="crt-vignette pointer-events-none fixed inset-0 z-50" />
    </div>
  );
};

export default TerminalScreen;
