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
  { label: "COMMS", command: "comms" },
];

interface TerminalHeaderProps {
  onCommand: (cmd: string) => void;
}

const TerminalHeader: FC<TerminalHeaderProps> = ({ onCommand }) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-terminal-green/40 font-mono text-terminal-green text-xs sm:text-sm shrink-0 select-none">
      {/* Logo */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs sm:text-sm font-bold tracking-wide" style={{ textShadow: "0 0 8px var(--terminal-glow)" }}>
          TERRY.DEV/PORTFOLIO
        </span>
      </div>

      {/* Brand */}
      <div
        className="font-bold tracking-[0.25em] text-center whitespace-nowrap"
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
      </nav>

      {/* Mobile nav toggle hint */}
      <button
        className="md:hidden hover:bg-terminal-green/20 px-1.5 py-0.5 rounded-sm cursor-pointer"
        onClick={() => onCommand("help")}
      >
        [MENU]
      </button>
    </header>
  );
};

export default TerminalHeader;
