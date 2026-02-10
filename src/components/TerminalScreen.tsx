import { useState, useEffect, useRef, useCallback, FC } from "react";
import TerminalHeader from "./TerminalHeader";
import { executeCommand, type OutputLine } from "@/lib/terminalCommands";

const BOOT_LINES = [
  "TERRY SYSTEMS (TM) PORTFOLIO INTERFACE",
  "AIDEN TERRY PROFESSIONAL ACCESS SYSTEM V1.0",
  "COPYRIGHT 2021 TERRY SYSTEMS",
  "",
  "INITIALIZING...",
  "LOADING PERSONNEL FILES... DONE",
  "LOADING PROJECT ARCHIVES... DONE",
  "LOADING WORK HISTORY... DONE",
  "LOADING COMMUNICATIONS... DONE",
  "LOADING CERTIFICATIONS... DONE",
  "",
];

type Phase = "boot" | "shell";

const TerminalScreen: FC = () => {
  const [phase, setPhase] = useState<Phase>("boot");
  const [bootIndex, setBootIndex] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, [outputLines, bootIndex]);

  // Focus input when shell active
  useEffect(() => {
    if (phase === "shell") inputRef.current?.focus();
  }, [phase, outputLines]);

  const runCommand = useCallback((cmd: string) => {
    const result = executeCommand(cmd);
    if (result === "clear") {
      setOutputLines([]);
    } else {
      setOutputLines((prev) => [
        ...prev,
        { text: `> ${cmd}` },
        ...result,
      ]);
    }
    setInputValue("");
  }, []);

  const enterShell = useCallback(() => {
    setPhase("shell");
    const help = executeCommand("help");
    if (help !== "clear") {
      setOutputLines([
        { text: "SYSTEM READY. TYPE 'HELP' FOR AVAILABLE COMMANDS." },
        { text: "" },
        ...help,
      ]);
    }
  }, []);

  const handleHeaderCommand = (cmd: string) => {
    if (phase === "boot") enterShell();
    runCommand(cmd);
    inputRef.current?.focus();
  };

  return (
    <div className="crt-screen flex flex-col h-screen w-screen bg-background text-foreground font-mono overflow-hidden">
      <TerminalHeader onCommand={handleHeaderCommand} />

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 focus:outline-none text-sm leading-relaxed text-glow"
        tabIndex={0}
        onKeyDown={(e) => {
          if (phase === "boot" && e.key === "Enter" && showPrompt) {
            enterShell();
          }
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {phase === "boot" && (
          <div className="space-y-1">
            {BOOT_LINES.slice(0, bootIndex).map((l, i) => (
              <div key={i} className="whitespace-pre">
                {l || "\u00A0"}
              </div>
            ))}
            {showPrompt && (
              <div className="mt-4 animate-pulse">
                {">"} PRESS ENTER TO CONTINUE
                <span className="inline-block w-2.5 h-4 bg-foreground ml-1 animate-[blink_1s_step-end_infinite]" />
              </div>
            )}
          </div>
        )}

        {phase === "shell" && (
          <div>
            {outputLines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap break-all">
                {line.isLink && line.url ? (
                  <a
                    href={line.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:bg-foreground/20 transition-colors"
                  >
                    {line.text}
                  </a>
                ) : (
                  line.text || "\u00A0"
                )}
              </div>
            ))}

            {/* Input line */}
            <div className="flex items-center mt-1">
              <span className="mr-1">{">"}</span>
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      runCommand(inputValue);
                    }
                  }}
                  className="bg-transparent border-none outline-none text-foreground font-mono w-full caret-transparent"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
                {/* Block cursor */}
                <span
                  className="absolute top-0 inline-block w-2.5 h-5 bg-foreground animate-[blink_1s_step-end_infinite] pointer-events-none"
                  style={{ left: `${inputValue.length}ch` }}
                />
              </div>
            </div>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* CRT overlays */}
      <div className="crt-scanlines pointer-events-none fixed inset-0 z-50" />
      <div className="crt-vignette pointer-events-none fixed inset-0 z-50" />
    </div>
  );
};

export default TerminalScreen;
