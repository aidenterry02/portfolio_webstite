import { personnel, projects, records, comms, skills, awards, collegePositions, collegeMemberships, startups } from "./portfolioData";

export type OutputLine = { text: string; isLink?: boolean; url?: string };

function line(text: string): OutputLine {
  return { text };
}

function link(text: string, url: string): OutputLine {
  return { text, isLink: true, url };
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

function cmdProjects(): OutputLine[] {
  const out: OutputLine[] = [line(""), line(SEP), line("  PROJECT ARCHIVES"), line(SEP)];
  projects.forEach((p, i) => {
    const idx = String(i + 1).padStart(3, "0");
    out.push(line(`  [${idx}] ${p.name}`));
    out.push(line(`        Status: ${p.status}`));
    out.push(line(`        Tech:   ${p.tech}`));
    
    // Wrap long descriptions
    const descLines = wrapText(p.description, 75);
    descLines.forEach((desc, i) => {
      const prefix = i === 0 ? "Desc:   " : "        ";
      out.push(line(`        ${prefix}${desc}`));
    });
    
    if (p.link) out.push(link(`        Link:   ${p.link}`, p.link));
    out.push(line(THIN));
  });
  out.push(line(""));
  return out;
}

function cmdRecords(): OutputLine[] {
  const out: OutputLine[] = [line(""), line(SEP), line("  WORK HISTORY RECORDS"), line(SEP)];
  records.forEach((r) => {
    out.push(line(`  ${r.title}`));
    out.push(line(`  ${r.organization} | ${r.period}`));
    out.push(line(`  ${r.description}`));
    out.push(line(THIN));
  });
  out.push(line(""));
  return out;
}

function cmdComms(): OutputLine[] {
  const out: OutputLine[] = [line(""), line(SEP), line("  EXTERNAL COMMUNICATIONS"), line(SEP)];
  comms.forEach((c) => {
    out.push(link(`  [${c.label}] ${c.url}`, c.url));
    out.push(line(`    Type: ${c.type}`));
    out.push(line(THIN));
  });
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
    out.push(line(`    ${p.description}`));
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

function cmdHelp(): OutputLine[] {
  return [
    line(""),
    line("AVAILABLE COMMANDS:"),
    line("  personnel  - View personnel file"),
    line("  projects   - Browse project archives"),
    line("  records    - Access work history"),
    line("  comms      - External communications"),
    line("  skills     - Certifications & skills"),
    line("  awards     - Awards & achievements"),
    line("  college    - College positions & leadership"),
    line("  startups   - Startup ventures & funding"),
    line("  help       - Display this help message"),
    line("  clear      - Clear terminal output"),
    line(""),
  ];
}

const commandMap: Record<string, () => OutputLine[]> = {
  personnel: cmdPersonnel,
  projects: cmdProjects,
  records: cmdRecords,
  comms: cmdComms,
  skills: cmdSkills,
  awards: cmdAwards,
  college: cmdCollege,
  startups: cmdStartups,
  help: cmdHelp,
};

export function executeCommand(input: string): OutputLine[] | "clear" {
  const cmd = input.trim().toLowerCase();
  if (cmd === "clear") return "clear";
  if (cmd === "") return [];
  const handler = commandMap[cmd];
  if (handler) return handler();
  return [
    line(""),
    line(`ERROR: COMMAND NOT RECOGNIZED — "${input.trim().toUpperCase()}"`),
    line("TYPE 'HELP' FOR AVAILABLE COMMANDS."),
    line(""),
  ];
}
