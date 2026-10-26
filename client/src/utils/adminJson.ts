export type AdminJsonParseResult = { value: Record<string, unknown> | null; error: string };

export function parseAdminJsonObject(source: string): AdminJsonParseResult {
  try {
    const parsed: unknown = JSON.parse(source);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { value: null, error: 'Enter a JSON object to apply changes.' };
    }
    return { value: parsed as Record<string, unknown>, error: '' };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : '';
    const offsetMatch = message.match(/position\s+(\d+)/i);
    const offset = Math.min(Number(offsetMatch?.[1] ?? source.length), source.length);
    const prefix = source.slice(0, offset);
    const line = prefix.split('\n').length;
    const column = offset - prefix.lastIndexOf('\n');
    return { value: null, error: `Invalid JSON at line ${line}, column ${column}.` };
  }
}
