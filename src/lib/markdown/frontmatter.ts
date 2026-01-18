export type FrontmatterValue = string | string[];
export type Frontmatter = Record<string, FrontmatterValue>;

const parseFrontmatterValue = (value: string): string => {
  const trimmed = value.trim();
  const hasDoubleQuotes = trimmed.startsWith('"') && trimmed.endsWith('"');
  const hasSingleQuotes = trimmed.startsWith("'") && trimmed.endsWith("'");
  if (hasDoubleQuotes || hasSingleQuotes) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const parseFrontmatterBlock = (block: string): Frontmatter => {
  const metadata: Frontmatter = {};
  let activeListKey: string | null = null;

  for (const rawLine of block.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    if (line.startsWith('- ')) {
      if (!activeListKey) {
        throw new Error('Frontmatter list item is missing a key.');
      }
      const item = parseFrontmatterValue(line.slice(2));
      const existing = metadata[activeListKey];
      if (!Array.isArray(existing)) {
        metadata[activeListKey] = [item];
      } else {
        existing.push(item);
      }
      continue;
    }

    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    if (rawValue === '') {
      metadata[key] = [];
      activeListKey = key;
    } else {
      metadata[key] = parseFrontmatterValue(rawValue);
      activeListKey = null;
    }
  }

  return metadata;
};

export const parseFrontmatter = (raw: string): { metadata: Frontmatter; content: string } => {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) {
    throw new Error('Missing frontmatter in markdown file.');
  }

  const metadata = parseFrontmatterBlock(match[1]);
  const content = match[2].replace(/^\n+/, '');

  return { metadata, content };
};

export const getString = (metadata: Frontmatter, key: string): string => {
  const value = metadata[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing or invalid frontmatter field: ${key}`);
  }
  return value;
};

export const getStringArray = (metadata: Frontmatter, key: string): string[] => {
  const value = metadata[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`Missing or invalid frontmatter list: ${key}`);
  }
  return value;
};

export const getOptionalString = (metadata: Frontmatter, key: string): string | undefined => {
  const value = metadata[key];
  return typeof value === 'string' ? value : undefined;
};
