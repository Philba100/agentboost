import fs from 'node:fs';
import path from 'node:path';

const files = [
  'app/page.tsx',
  'app/dashboard/page.tsx',
  'app/lib/skillsData.ts',
  'app/skills/[skill]/SkillViewer.tsx',
  'app/skills/[skill]/page.tsx',
  'app/skills/[skill]/demo/page.tsx',
  'app/components/DesktopCommandCenter.tsx'
];

const replacements = [
  [/âœ“/g, '✓'],
  [/ðŸš€/g, '🚀'],
  [/ðŸŽ¯/g, '🎯'],
  [/âš ï¸ /g, '⚠️'],
  [/â† /g, '←'],
  [/âš¡/g, '⚡'],
  [/ðŸ’¡/g, '💡'],
  [/ðŸ“±/g, '📱'],
  [/ðŸ“Š/g, '📊'],
  [/ðŸ“ˆ/g, '📈'],
  [/ðŸ“œ/g, '📜'],
  [/âš–ï¸ /g, '⚖️'],
  [/ðŸ¤ /g, '🤝'],
  [/ðŸ“…/g, '📅'],
  [/âœ‰ï¸ /g, '✉️'],
  [/ðŸ”—/g, '🔗'],
  [/â˜ ï¸ /g, '☁️'],
  [/ðŸ ·ï¸ /g, '🏷️'],
  [/ðŸ’¬/g, '💬'],
  [/ðŸ  /g, '🏢'],
  [/ðŸ›¡ï¸ /g, '🛡️'],
  [/â—‹/g, '○'],
  [/â†’/g, '→']
];

for (const relPath of files) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) continue;
  let content = fs.readFileSync(fullPath, 'utf8');
  for (const [regex, rep] of replacements) {
    content = content.replace(regex, rep);
  }
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Cleaned encoding for: ${relPath}`);
}
