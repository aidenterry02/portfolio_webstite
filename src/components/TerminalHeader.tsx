import { FC } from "react";

interface NavItem {
  label: string;
  command: string;
}

const navItems: NavItem[] = [
  { label: "PERSONNEL FILE", command: "personnel" },
  { label: "PROJECT ARCHIVES", command: "projects" },
  { label: "WORK HISTORY", command: "records" },
  { label: "AWARDS", command: "awards" },
  { label: "COLLEGE", command: "college" },
  { label: "STARTUPS", command: "startups" },
  { label: "SKILLS", command: "skills" },
];

const ctaCommand = "email";

interface TerminalHeaderProps {
  onCommand: (cmd: string) => void;
}

const TerminalHeader: FC<TerminalHeaderProps> = ({ onCommand }) => {
  return (
    <header className="flex items-center justify-between px-2 sm:px-4 py-2 border-b border-terminal-green/40 font-mono text-terminal-green text-xs sm:text-sm shrink-0 select-none">
      {/* Logo */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        <span className="text-[10px] sm:text-sm font-bold tracking-wide truncate" style={{ textShadow: "0 0 8px var(--terminal-glow)" }}>
          System.root
        </span>
      </div>

      {/* Brand */}
      <div
        className="hidden sm:block font-bold tracking-[0.25em] text-center whitespace-nowrap"
        style={{ textShadow: "0 0 10px var(--terminal-glow)" }}
      >
        TERRY ENTERPRISE ↈ
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-1 flex-wrap justify-end">
        {navItems.map((item) => (
          <button
            key={item.command}
            onClick={() => onCommand(item.command)}
            className="hover:bg-terminal-green/20 px-1.5 py-0.5 transition-colors rounded-sm whitespace-nowrap cursor-pointer"
          >
            [{item.label}]
          </button>
        ))}
        <button
          onClick={() => onCommand(ctaCommand)}
          className="ml-1 px-2 py-0.5 rounded-sm border border-terminal-green bg-terminal-green/10 hover:bg-terminal-green/30 transition-colors whitespace-nowrap cursor-pointer"
          style={{ textShadow: "0 0 12px var(--terminal-glow)" }}
        >
          [SEND TRANSMISSION]
        </button>
      </nav>

      {/* Mobile nav toggle hint */}
      <div className="md:hidden flex items-center gap-1">
        <button
          className="hover:bg-terminal-green/20 px-2 py-1 rounded-sm cursor-pointer touch-manipulation text-[10px] sm:text-xs font-bold"
          onClick={() => onCommand(ctaCommand)}
        >
          [SEND TRANSMISSION]
        </button>
        <button
          className="hover:bg-terminal-green/20 px-2 py-1 rounded-sm cursor-pointer touch-manipulation text-[10px] sm:text-xs font-bold"
          onClick={() => onCommand("help")}
        >
          [HELP]
        </button>
      </div>
    </header>
  );
};

export default TerminalHeader;
