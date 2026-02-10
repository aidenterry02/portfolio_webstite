import { personnel, projects, records, comms, skills } from "./portfolioData";

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

function cmdProjects(): OutputLine[] {
  const out: OutputLine[] = [line(""), line(SEP), line("  PROJECT ARCHIVES"), line(SEP)];
  projects.forEach((p, i) => {
    const idx = String(i + 1).padStart(3, "0");
    out.push(line(`  [${idx}] ${p.name}`));
    out.push(line(`        Status: ${p.status}`));
    out.push(line(`        Tech:   ${p.tech}`));
    out.push(line(`        Desc:   ${p.description}`));
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

function cmdHelp(): OutputLine[] {
  return [
    line(""),
    line("AVAILABLE COMMANDS:"),
    line("  personnel  - View personnel file"),
    line("  projects   - Browse project archives"),
    line("  records    - Access work history"),
    line("  comms      - External communications"),
    line("  skills     - Certifications & skills"),
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
