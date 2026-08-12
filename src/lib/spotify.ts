/** Parse Spotify share links / URIs into an embeddable player URL. */

export type SpotifyKind = "track" | "album" | "playlist" | "episode" | "show";

const KIND_RE = /(track|album|playlist|episode|show)/i;
const ID_RE = /([a-zA-Z0-9]{22})/;

export function parseSpotifyLink(input: string): { kind: SpotifyKind; id: string } | null {
  const raw = input.trim();
  if (!raw) return null;

  // spotify:track:ID
  const uri = raw.match(/^spotify:(track|album|playlist|episode|show):([a-zA-Z0-9]{22})$/i);
  if (uri) {
    return { kind: uri[1].toLowerCase() as SpotifyKind, id: uri[2] };
  }

  try {
    const url = new URL(raw);
    if (!url.hostname.includes("spotify.com")) return null;
    const parts = url.pathname.split("/").filter(Boolean);
    // intl-xx/track/ID or track/ID
    const kindIdx = parts.findIndex((p) => KIND_RE.test(p));
    if (kindIdx === -1 || kindIdx + 1 >= parts.length) return null;
    const kind = parts[kindIdx].toLowerCase() as SpotifyKind;
    const idMatch = parts[kindIdx + 1].match(ID_RE);
    if (!idMatch) return null;
    return { kind, id: idMatch[1] };
  } catch {
    return null;
  }
}

export function toSpotifyEmbedUrl(input: string): string | null {
  const parsed = parseSpotifyLink(input);
  if (!parsed) return null;
  return `https://open.spotify.com/embed/${parsed.kind}/${parsed.id}?utm_source=generator&theme=0`;
}

export function isSpotifyLink(input: string): boolean {
  return parseSpotifyLink(input) !== null;
}
