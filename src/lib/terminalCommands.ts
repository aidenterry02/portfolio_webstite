import { personnel, projects, records, comms, skills, awards, collegePositions, collegeMemberships, startups, now, timeline } from "./portfolioData";

export type OutputLine = { text: string; isLink?: boolean; url?: string; command?: string; copyable?: string };

function line(text: string): OutputLine {
  return { text };
}

function link(text: string, url: string): OutputLine {
  return { text, isLink: true, url };
}

function commandLine(text: string, command: string): OutputLine {
  return { text, command };
}

const SEP = "════════════════════════════════════════";
const THIN = "────────────────────────────────────────";

function cmdPersonnel(): OutputLine[] {
  return [
    line(""),
    line(SEP),
    line(`  PERSONNEL FILE: ${personnel.name}`),
    line(SEP),
    line(`  DESIGNATION:  ${personnel.designation}`),
    line(`  STATUS:       ${personnel.status}`),
    line(`  LOCATION:     ${personnel.location}`),
    line(`  CLEARANCE:    ${personnel.clearance}`),
    line(""),
    ...personnel.bio.map((l) => line(`  ${l}`)),
    line(""),
    line(SEP),
    line(""),
  ];
}

function wrapText(text: string, width: number = 80): string[] {
  const lines: string[] = [];
  let currentLine = "";
  const words = text.split(" ");
  
  for (const word of words) {
    if ((currentLine + word).length > width) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

function cmdProjectsList(): OutputLine[] {
  const out: OutputLine[] = [line(""), line(SEP), line("  PROJECT ARCHIVES - LIST"), line(SEP)];
  out.push(line(""));
  projects.forEach((p, i) => {
    const idx = String(i + 1).padStart(2, "0");
    const projectNum = i + 1;
    out.push(commandLine(`  [${idx}] ${p.name}`, `projects ${projectNum}`));
  });
  out.push(line(""));
  out.push(line("Type 'projects <number>' for details. Example: 'projects 1'"));
  out.push(line("Search with: 'projects search <keyword>'"));
  out.push(line(""));
  return out;
}

function cmdProjectDetail(projectIndex: number): OutputLine[] {
  const idx = projectIndex - 1;
  if (idx < 0 || idx >= projects.length) {
    return [
      line(""),
      line(`ERROR: PROJECT [${projectIndex}] NOT FOUND`),
      line(`Valid range: 1 to ${projects.length}`),
      line(""),
    ];
  }

  const p = projects[idx];
  const out: OutputLine[] = [line(""), line(SEP), line(`  PROJECT [${String(idx + 1).padStart(2, "0")}]: ${p.name}`), line(SEP)];
  out.push(line(`  Status: ${p.status}`));
  out.push(line(`  Tech:   ${p.tech}`));
  out.push(line(""));
  
  const descLines = wrapText(p.description, 75);
  descLines.forEach((desc, i) => {
    const prefix = i === 0 ? "Desc:   " : "        ";
    out.push(line(`  ${prefix}${desc}`));
  });

  if (p.link) out.push(line(`  Link:   ${p.link}`));
  out.push(line(""));
  out.push(line(SEP));
  out.push(line(""));
  return out;
}

function cmdProjectSearch(keyword: string): OutputLine[] {
  const searchTerm = keyword.toLowerCase();
  const matches = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.tech.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm)
  );

  if (matches.length === 0) {
    return [
      line(""),
      line(`NO PROJECTS FOUND FOR: "${keyword}"`),
      line(""),
    ];
  }

  const out: OutputLine[] = [line(""), line(SEP), line(`  SEARCH RESULTS FOR: "${keyword}" (${matches.length} found)`), line(SEP)];
  out.push(line(""));
  
  matches.forEach((p) => {
    const idx = projects.indexOf(p) + 1;
    out.push(commandLine(`  [${String(idx).padStart(2, "0")}] ${p.name}`, `projects ${idx}`));
    out.push(line(`       Tech: ${p.tech}`));
  });
  
  out.push(line(""));
  out.push(line("Type 'projects <number>' for full details"));
  out.push(line(""));
  return out;
}

function cmdProjects(args: string[]): OutputLine[] {
  if (args.length === 0) {
    return cmdProjectsList();
  }

  if (args[0].toLowerCase() === "all") {
    const out: OutputLine[] = [line(""), line(SEP), line("  PROJECT ARCHIVES - FULL"), line(SEP)];
    projects.forEach((p, i) => {
      const idx = String(i + 1).padStart(2, "0");
      out.push(line(`  [${idx}] ${p.name}`));
      out.push(line(`  Status: ${p.status}`));
      out.push(line(`  Tech:   ${p.tech}`));
      const descLines = wrapText(p.description, 75);
      descLines.forEach((desc, j) => {
        const prefix = j === 0 ? "Desc:   " : "        ";
        out.push(line(`  ${prefix}${desc}`));
      });
      if (p.link) out.push(line(`  Link:   ${p.link}`));
      out.push(line(THIN));
    });
    out.push(line(""));
    return out;
  }

  if (args[0].toLowerCase() === "search") {
    const searchQuery = args.slice(1).join(" ");
    if (!searchQuery) {
      return [line(""), line("ERROR: Please provide a search term"), line("Usage: projects search <keyword>"), line("")];
    }
    return cmdProjectSearch(searchQuery);
  }

  const projectNum = parseInt(args[0], 10);
  if (isNaN(projectNum)) {
    return [line(""), line(`ERROR: INVALID ARGUMENT "${args[0]}"`), line("Usage: projects <number> | projects all | projects search <keyword>"), line("")];
  }

  return cmdProjectDetail(projectNum);
}

function cmdRecords(): OutputLine[] {
  const out: OutputLine[] = [line(""), line(SEP), line("  WORK HISTORY RECORDS"), line(SEP)];
  records.forEach((r) => {
    out.push(line(`  ${r.title}`));
    out.push(line(`  ${r.organization} | ${r.period}`));
    out.push(line(""));
    
    const descLines = wrapText(r.description, 75);
    descLines.forEach((desc, i) => {
      const prefix = i === 0 ? "• " : "  ";
      out.push(line(`  ${prefix}${desc}`));
    });
    
    out.push(line(THIN));
  });
  out.push(line(""));
  return out;
}

function cmdComms(): OutputLine[] {
  const out: OutputLine[] = [line(""), line(SEP), line("  EXTERNAL COMMUNICATIONS"), line(SEP)];
  comms.forEach((c) => {
    out.push({ text: `  [${c.label}] ${c.url}`, isLink: true, url: c.url, copyable: c.url });
    out.push(line(`    Type: ${c.type}`));
    out.push(line(THIN));
  });
  out.push(line(""));
  out.push(line("TIP: Click any link to copy it to clipboard"));
  out.push(line(""));
  return out;
}

function cmdSkills(): OutputLine[] {
  const out: OutputLine[] = [line(""), line(SEP), line("  CERTIFICATIONS & SKILLS"), line(SEP)];
  skills.forEach((s) => {
    out.push(line(`  [${s.category}]`));
    out.push(line(`    ${s.items.join(" | ")}`));
    out.push(line(THIN));
  });
  out.push(line(""));
  return out;
}

function cmdAwards(): OutputLine[] {
  const out: OutputLine[] = [line(""), line(SEP), line("  AWARDS & ACHIEVEMENTS"), line(SEP)];
  awards.forEach((a) => {
    out.push(line(`  [${a.title}]`));
    out.push(line(`    Status: ${a.status}`));
    out.push(line(`    ${a.details}`));
    out.push(line(THIN));
  });
  out.push(line(""));
  return out;
}

function cmdCollege(): OutputLine[] {
  const out: OutputLine[] = [line(""), line(SEP), line("  COLLEGE POSITIONS & LEADERSHIP"), line(SEP)];
  collegePositions.forEach((p) => {
    out.push(line(`  [${p.title}]`));
    out.push(line(`    Organization: ${p.organization}`));
    out.push(line(`    Period:       ${p.period}`));
    const descLines = wrapText(p.description, 75);
    descLines.forEach((desc, i) => {
      const prefix = i === 0 ? "Desc:   " : "        ";
      out.push(line(`    ${prefix}${desc}`));
    });
    out.push(line(THIN));
  });
  
  out.push(line(""));
  out.push(line(SEP));
  out.push(line("  ORGANIZATION MEMBERSHIPS"));
  out.push(line(SEP));
  collegeMemberships.forEach((m) => {
    out.push(line(`  [${m.name}]`));
    out.push(line(`    Type:   ${m.type}`));
    out.push(line(`    Period: ${m.period}`));
    out.push(line(THIN));
  });
  
  out.push(line(""));
  return out;
}

function cmdStartups(): OutputLine[] {
  const out: OutputLine[] = [line(""), line(SEP), line("  STARTUP VENTURES"), line(SEP)];
  startups.forEach((s) => {
    out.push(line(`  [${s.name}]`));
    out.push(line(`    Role:      ${s.role}`));
    out.push(line(`    Period:    ${s.period}`));
    if (s.fundingRaised) out.push(line(`    Funding:   ${s.fundingRaised}`));
    
    // Wrap long descriptions
    const descLines = wrapText(s.description, 75);
    descLines.forEach((desc, i) => {
      const prefix = i === 0 ? "Desc:   " : "        ";
      out.push(line(`    ${prefix}${desc}`));
    });
    
    out.push(line(THIN));
  });
  out.push(line(""));
  return out;
}

function cmdEmail(): OutputLine[] {
  return [
    line(""),
    line(SEP),
    line("  SEND TRANSMISSION"),
    line(SEP),
    line(""),
    line("  Enter your message details:"),
    line(""),
    line("  [EMAIL_FORM]"),
    line(""),
    line(SEP),
    line(""),
  ];
}

// Easter Eggs
function cmdMatrix(): OutputLine[] {
  return [
    line(""),
    line("01010111 01100001 01101011 01100101 00100000 01110101 01110000"),
    line("01001110 01100101 01101111"),
    line(""),
    line("The Matrix has you..."),
    line("Follow the white rabbit."),
    line(""),
    line("(Wake up, Neo)"),
    line(""),
  ];
}

function cmdHack(): OutputLine[] {
  return [
    line(""),
    line("INITIALIZING HACK SEQUENCE..."),
    line(""),
    line("[████████████████████████████████] 100%"),
    line(""),
    line("ACCESSING MAINFRAME..."),
    line("BYPASSING FIREWALL..."),
    line("DOWNLOADING FILES..."),
    line(""),
    line("Just kidding. I'm a portfolio website, not Mr. Robot"),
    line(""),
  ];
}

function cmdWhoami(): OutputLine[] {
  return [
    line(""),
    line("You are: A VISITOR"),
    line("Status: CURIOUS"),
    line("Access Level: GUEST"),
    line(""),
    line("But more importantly..."),
    line("You found an easter egg!"),
    line(""),
  ];
}

function cmdSudo(): OutputLine[] {
  return [
    line(""),
    line("sudo: you do not have permission to be this cool"),
    line(""),
    line("This incident will be reported to Aiden."),
    line("(Just kidding, you're already cool for finding this)"),
    line(""),
  ];
}

function cmdCoffee(): OutputLine[] {
  return [
    line(""),
    line("      )  ("),
    line("     (   ) )"),
    line("      ) ( ("),
    line("    _______)_"),
    line("  .-'---------|  "),
    line(" ( C|/\\/\\/\\/\\/|"),
    line("  '-./\\/\\/\\/\\/|"),
    line("    '_________'"),
    line("     '-------'"),
    line(""),
    line("Coffee brewing... Developer fuel acquired."),
    line(""),
  ];
}

function cmd420(): OutputLine[] {
  return [
    line(""),
    line("Nice."),
    line(""),
    line("Error 420: Enhance your calm"),
    line(""),
  ];
}

function cmd69(): OutputLine[] {
  return [
    line(""),
    line("Nice."),
    line(""),
  ];
}

function cmd67(): OutputLine[] {
  return [
    line(""),
    line("=-----=========++==----===================++=--=+++===------===++==++=++===*%%@#=--=+##+=-"),
    line("----=======---=+===-------============++*+***++==--------------======*@@@*==*%*=----=====+"),
    line("--------===---=+==--------========+***%%*++#####**+==-------------====#%#===+%#+=+++**+=++"),
    line("---==---===---=++==-------==++++**##%*%%#*#***%%%##*#*+==------====++=+@*=+#@@@@@@@@@@%%%%"),
    line("---===--===---=++==-------===+****%#%#****###**%%%%%#*#*+=--=+*@@@@@@==++*@@@@@%@%@@@@@%##"),
    line("---========-===**+=-------==*+**##*@@@**#*#*#*##%%#**####+=*@%@@@%@@@@@@@@@@@@@%#%%*+####*"),
    line("---============+==-------=+*++*%%##%@*+*%%#****+*++*#%%%##**%#%%@@@@@@@@@@@@@@@@@@%%=*%@%%"),
    line("---========--======+*++==+*++*###*##**##%####%%%###%%@@%@%**#@@@@@@%@@@@@@@@@@@%*=-==**%@@"),
    line("---====---====##==*@@@@@#*#*###%@%@%%%%%#**#%%@@@@@@@@@@@@%####@@@@@@%#%@@@@@@*==+*#@@@@@@"),
    line("-----=+**++#========++#%*##@@@@%%%%%%%%%#*+*#@@@@@@@@@@@@@@@%##@@*+++++*###%@@@##@@@@@@@@@"),
    line("----=%@@@@@@@@@#***#*+*##**#%%%%@%%@@@%%#*++#@@@@@@@@@@@@@@@@%###*#*+****#%@@@@%@@@@@@@@@@"),
    line("#****#%@@@@%%%@@@##%#*#%%@@@@@@%@@@@@%%#*+==*%%%%%@@%%%@@@@@@@@#%%##*##%%##@@@@@@@@@@@@@@@"),
    line("@@@@@@@%@@@@@@@@@@@%%##%@@@@@@**++***#*+++==+####*#%#####%@@@@@#**+*#%@%#**%@@@@@@@@@@@@@@"),
    line("%%@@@@%*#%@%#%%%@@@@@%%@@@@@@#=++++===++++=++###*++++++**#@@@@@@%#********++%@@@@@@@@@@@@@"),
    line("%@@@@%%@@@@@%###%@@@@#%@@%@@@#======++++#%%%@@%#*++++++**#@@@@@@@@%#****++===+@@@@@@@@@@@@"),
    line("%%%@@%%@@@@@@@@%%#*+***#%@@@@#===++*##+*%##%%@@%**#***##%%@@@@@@@@%#*+++===++#@@@@@@@@@@@@"),
    line("@@@@@@@@@@@@@@@%##*++*#%%%%@@%+++*#%%*====++***+**%%%#%%@@@@@@@@%##**++++++++@@@@@@@@@@@@@"),
    line("@@@%@@@@@@@@@@@@%#++**##%@@@@@++*#%%*++****###****#%@%%@@@@@@@@@@@%#**++++++*@@@@@@@@@@@@@"),
    line("@%%%@@@@@##@@@@@@%####%%@@@@@@%***%%#@@%%#*#%#@@@@@@%#%%@@@@@@@@@@@%**++++++#@@@@@@@@@@@@@"),
    line("*#@@@@@%%@@@@@@@@#####%%%@@@@@@#***%#@@@@@@@@@@@@@@%##%@@@@@@@@@@%#**++++***%@@@@@@@@@@@@@"),
    line("@@@@@@@@@@@%%%%%%#***#%%@@@@@@@@#**#*#@@@@@@@@@@@@%%*%@@@@@@@@@@@%*******###@@@@@@@@@@@@@@"),
    line("@@@@@@@@@@@%%%%%#######%@@@@@@@@@#***+*@@#%%%%%@@%%##@@@@@@@@@@@@%**+**####%@@@@@@@@@@@@@@"),
    line("@@@@@@@@@@@@%%@%%%%%%%@@@@#@@@@@@@**+++*######%%%%%#%@@@@@@@@@@@@%##*#**###@@@@@@@@@@@@@@@"),
    line("@@@@@@@@@@@@@%%%%%%%@@@@#=+*%%@@@@%*++++##%%%%@@%%##@@@@@@@@@@@@%##%@#++*##@@@@@@@@@@@@@@@"),
    line("@@@@@@@@@@@@@@%@@@@@@@%+==+*###@@@@**+++**###%#####@@@@@@@@@@@@%%%@@#*****#@@@@@@@@@@@@@@@"),
    line("@@@@@@@@@@@@@@@@@@@@@@+==++*####@@@#*#*++******##%@@@@@@@@@@@@%@@@%#######%@@@@@@@@@@@@@@@"),
    line("@@@@@@@@@@@@@@@@@@@@%*++++**#####%@%*###**#####%@@@@@@@@@@%%%@@@@%%%##%%%%@@@@@@@@@@@@@@@@"),
    line("@@@@@@@@@@@@@@@@@@%+==++##**#####%%@%##%%%%@@@@@@@@@@@@@@@@@@@@@@%%%#%%%%@@@@@@@@@@@@@@@@@"),
    line(""),
  ];
}

function cmdKonami(): OutputLine[] {
  return [
    line(""),
    line("↑ ↑ ↓ ↓ ← → ← → B A"),
    line(""),
    line("KONAMI CODE ACTIVATED!"),
    line(""),
    line("Achievement Unlocked: 90s Kid"),
    line("+30 Lives"),
    line("+Unlimited Nostalgia"),
    line(""),
  ];
}

function cmdSecret(): OutputLine[] {
  return [
    line(""),
    line("CONGRATULATIONS!"),
    line(""),
    line("You found the secret command!"),
    line(""),
    line("Here are all the easter eggs:"),
    line("  • matrix    - Follow the white rabbit"),
    line("  • hack      - Hacker mode activated"),
    line("  • whoami    - Identity crisis"),
    line("  • sudo      - Permission denied"),
    line("  • coffee    - Brew some fuel"),
    line("  • 420       - Enhance your calm"),
    line("  • 69        - Nice"),
    line("  • 67        - ASCII surprise"),
    line("  • konami    - Cheat code"),
    line("  • secret    - You're here!"),
    line(""),
  ];
}

function cmdResume(): OutputLine[] {
  // Open resume in new tab
  window.open(`${import.meta.env.BASE_URL}resume.pdf`, "_blank");
  return [
    line(""),
    line("OPENING RESUME IN NEW TAB..."),
    line(""),
    line("If the resume doesn't open, please ensure popup blocker is disabled."),
    line(""),
  ];
}

function cmdNow(): OutputLine[] {
  const out: OutputLine[] = [line(""), line(SEP), line("  WHAT I'M UP TO NOW"), line(SEP)];
  now.forEach((section) => {
    out.push(line(""));
    out.push(line(`  [${section.category}]`));
    section.items.forEach((item) => {
      out.push(line(`    • ${item}`));
    });
  });
  out.push(line(""));
  out.push(line("Last updated: February 2026"));
  out.push(line(""));
  return out;
}

function cmdTimeline(): OutputLine[] {
  const out: OutputLine[] = [
    line(""),
    line(SEP),
    line("  PROFESSIONAL TIMELINE"),
    line(SEP),
    line("")
  ];

  // Group by year
  const grouped = timeline.reduce((acc, event) => {
    if (!acc[event.year]) acc[event.year] = [];
    acc[event.year].push(event);
    return acc;
  }, {} as Record<string, typeof timeline>);

  // Sort years in ascending order (oldest first)
  const years = Object.keys(grouped).sort((a, b) => parseInt(a) - parseInt(b));

  years.forEach((year, yearIndex) => {
    const events = grouped[year];
    
    events.forEach((event, eventIndex) => {
      const isFirst = eventIndex === 0;
      
      // Year marker
      if (isFirst) {
        out.push(line(`  ${year}  ┌─────────────────────────────────────`));
      } else {
        out.push(line(`       │`));
      }
      
      out.push(line(`       ├── ${event.title}`));
      out.push(line(`       │   ${event.organization}`));
      if (event.description) {
        out.push(line(`       │   ${event.description}`));
      }
    });
    
    // Add connector to next year or end
    if (yearIndex < years.length - 1) {
      out.push(line(`       │`));
    } else {
      out.push(line(`       └─────────────────────────────────────`));
    }
  });

  out.push(line(""));
  return out;
}

function cmdTheme(args: string[]): OutputLine[] {
  const availableThemes = ["green", "amber", "blue", "purple", "cyan"];
  
  if (args.length === 0) {
    return [
      line(""),
      line(SEP),
      line("  THEME SELECTOR"),
      line(SEP),
      line(""),
      line("Available themes:"),
      ...availableThemes.map((t) => commandLine(`  • ${t}`, `theme ${t}`)),
      line(""),
      line("Usage: theme <color>"),
      line("Example: theme amber"),
      line(""),
    ];
  }

  const theme = args[0].toLowerCase();
  
  if (!availableThemes.includes(theme)) {
    return [
      line(""),
      line(`ERROR: Unknown theme "${theme}"`),
      line("Available themes: " + availableThemes.join(", ")),
      line(""),
    ];
  }

  // Dispatch custom event to change theme
  window.dispatchEvent(new CustomEvent("themeChange", { detail: theme }));

  return [
    line(""),
    line(`THEME CHANGED TO: ${theme.toUpperCase()}`),
    line(""),
    line("Terminal color scheme updated."),
    line(""),
  ];
}

function cmdHelp(): OutputLine[] {
  return [
    line(""),
    line("AVAILABLE COMMANDS:"),
    commandLine("  personnel           - View personnel file", "personnel"),
    commandLine("  projects            - List all projects (1-22)", "projects"),
    commandLine("  projects all        - Expand all project details", "projects all"),
    commandLine("  records             - Access work history", "records"),
    commandLine("  comms               - External communications", "comms"),
    commandLine("  skills              - Certifications & skills", "skills"),
    commandLine("  awards              - Awards & achievements", "awards"),
    commandLine("  college             - College positions & leadership", "college"),
    commandLine("  startups            - Startup ventures & funding", "startups"),
    commandLine("  now                 - What I'm currently doing", "now"),
    commandLine("  timeline            - Professional timeline", "timeline"),
    commandLine("  theme               - Change terminal theme", "theme"),
    commandLine("  email               - Send a message", "email"),
    commandLine("  resume              - Open resume (PDF)", "resume"),
    commandLine("  help                - Display this help message", "help"),
    commandLine("  clear               - Clear terminal output", "clear"),
    line(""),
    line("TIPS:"),
    line("  • Press TAB to autocomplete commands"),
    line("  • Use ↑/↓ arrows to navigate command history"),
    line("  • Click or press any key to skip typing animation"),
    line(""),
  ];
}

const commandMap: Record<string, () => OutputLine[]> = {
  personnel: cmdPersonnel,
  projects: () => cmdProjects([]),
  records: cmdRecords,
  comms: cmdComms,
  skills: cmdSkills,
  awards: cmdAwards,
  college: cmdCollege,
  email: cmdEmail,
  startups: cmdStartups,
  now: cmdNow,
  timeline: cmdTimeline,
  theme: () => cmdTheme([]),
  resume: cmdResume,
  help: cmdHelp,
  matrix: cmdMatrix,
  hack: cmdHack,
  hacker: cmdHack,
  whoami: cmdWhoami,
  sudo: cmdSudo,
  coffee: cmdCoffee,
  brew: cmdCoffee,
  "420": cmd420,
  "69": cmd69,
  "67": cmd67,
  konami: cmdKonami,
  secret: cmdSecret,
};

export function executeCommand(input: string): OutputLine[] | "clear" {
  const trimmedInput = input.trim();
  if (trimmedInput.toLowerCase() === "clear") return "clear";
  if (trimmedInput === "") return [];
  
  // Parse command and arguments
  const parts = trimmedInput.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  // Handle special case for 'projects' command with arguments
  if (cmd === "projects") {
    return cmdProjects(args);
  }
  
  // Handle 'theme' command with arguments
  if (cmd === "theme") {
    return cmdTheme(args);
  }
  
  const handler = commandMap[cmd];
  if (handler) return handler();
  return [
    line(""),
    line(`ERROR: COMMAND NOT RECOGNIZED — "${trimmedInput.toUpperCase()}"`),
    line("TYPE 'HELP' FOR AVAILABLE COMMANDS."),
    line(""),
  ];
}
