import { ArrowRight, AudioLines, Atom, Bot, Braces, BriefcaseBusiness, BrainCircuit, Clock3, Cloud, Code2, Database, GraduationCap, Handshake, Hexagon, Layers, Link2, Puzzle, Rocket, Server, Sparkles, Trophy, Webhook, Workflow, Zap } from 'lucide-react';

// Icon names the portfolio JSON may use (the server validates against the same list: backend/constants/portfolio.js).
export const icons = { ArrowRight, AudioLines, Atom, Bot, Braces, BriefcaseBusiness, BrainCircuit, Clock3, Cloud, Code2, Database, GraduationCap, Handshake, Hexagon, Layers, Link2, Puzzle, Rocket, Server, Sparkles, Trophy, Webhook, Workflow, Zap };

export const iconNames = Object.keys(icons);

// An unknown name falls back to a neutral icon instead of breaking the page.
export function getIcon(name) {
  return icons[name] || Layers;
}
