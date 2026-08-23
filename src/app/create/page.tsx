"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import RakhiStage from "@/components/RakhiStage";
import RakhiSVG from "@/components/RakhiSVG";
import {
  STYLES,
  CHARMS,
  THREAD_SWATCHES,
  BEAD_SWATCHES,
  DEFAULT_THREAD_COLOR,
  DEFAULT_BEAD_COLOR,
  type RakhiStyle,
  type Charm,
} from "@/data/styles";
import { createRakhi, isFirebaseConfigured } from "@/lib/rakhi";
import { fileToDataUrl, MAX_SONG_BYTES } from "@/lib/songStore";
import { toSpotifyEmbedUrl } from "@/lib/spotify";
import { trackFunnel } from "@/lib/analytics";
import { isValidUpi, normalizeUpi } from "@/lib/upi";

const STYLE_CHARMS: Charm[] = ["om", "heart", "initial", "gem", "om", "heart", "initial", "gem", "om"];
const CHARM_ICON: Record<Charm, string> = {
  om: "ॐ",
  heart: "♥",
  initial: "A",
  gem: "◈",
};

function Swatches({
  colors,
  value,
  onChange,
}: {
  colors: string[];
  value: string;
  onChange: (c: string) => void;
}) {
  const picker = useRef<HTMLInputElement>(null);
  const isCustom = !colors.includes(value);
  return (
    <div className="flex items-center gap-2 mt-2 flex-wrap">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          aria-label={c}
          style={{ background: c }}
          className={`w-8 h-8 rounded-full ring-offset-2 ring-offset-paper transition ${
            value === c ? "ring-2 ring-lacquer scale-110" : "ring-1 ring-ink/10"
          }`}
        >
          {value === c && <span className="text-white text-xs drop-shadow">✓</span>}
        </button>
      ))}
      <button
        type="button"
        onClick={() => picker.current?.click()}
        style={isCustom ? { background: value } : undefined}
        className={`w-8 h-8 rounded-full border border-dashed grid place-items-center text-lacquer hover:border-lacquer ${
          isCustom ? "ring-2 ring-lacquer text-white" : "border-lacquer/40"
        }`}
        aria-label="Custom color"
      >
        {isCustom ? "✓" : "+"}
      </button>
      <input
        ref={picker}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </div>
  );
}


function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-2xl tracking-tight ${className}`}>
      Make Your <span className="text-lacquer-bright">Rakhi</span>
    </span>
  );
}

function Header() {
  return (
    <header className="page-shell flex items-center justify-between py-5 h-16">
      <Link href="/">
        <Wordmark className="text-ink" />
      </Link>
      <Link href="/" className="text-sm tracking-wide text-ink/70 link-underline hover:text-ink">
        Home
      </Link>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-plum text-cream-ink/60 border-t border-cream-ink/10 mt-auto">
      <div className="page-shell py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/">
          <Wordmark className="text-cream-ink" />
        </Link>
        <p className="text-sm italic font-display text-cream-ink/70">
          Not just a message. A moment.
        </p>
        <Link href="/" className="text-sm link-underline hover:text-cream-ink">
          Home
        </Link>
      </div>
    </footer>
  );
}

type RecipientType = "brother" | "sister" | "cousin" | "chosen-sibling";

const RECIPIENTS: { id: RecipientType; label: string }[] = [
  { id: "brother", label: "Brother" },
  { id: "sister", label: "Sister" },
  { id: "cousin", label: "Cousin" },
  { id: "chosen-sibling", label: "Chosen sibling" },
];

const MESSAGE_TEMPLATES = [
  { label: "Emotional", text: "No matter how far life takes us, you will always feel like home. Happy Raksha Bandhan." },
  { label: "Funny", text: "You are still the most annoying person I would protect without thinking twice. Happy Rakhi." },
  { label: "Long-distance", text: "Miles can change the view, not our bond. Sending this little Rakhi moment until we meet again." },
  { label: "Hindi / Hinglish", text: "Door ho, par dil ke hamesha paas ho. Happy Rakhi, meri favourite problem." },
  { label: "Custom", text: "" },
] as const;

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [recipientType, setRecipientType] = useState<RecipientType>("brother");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [style, setStyle] = useState<RakhiStyle>("traditional");
  const [threadColor, setThreadColor] = useState(DEFAULT_THREAD_COLOR);
  const [beadColor, setBeadColor] = useState(DEFAULT_BEAD_COLOR);
  const [charm, setCharm] = useState<Charm>("om");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string>(MESSAGE_TEMPLATES[0].text);
  const [upiId, setUpiId] = useState("");
  const [songName, setSongName] = useState<string | null>(null);
  const [songDataUrl, setSongDataUrl] = useState<string | null>(null);
  const [spotifyInput, setSpotifyInput] = useState("");
  const [spotifyEmbedUrl, setSpotifyEmbedUrl] = useState<string | null>(null);
  const [advanced, setAdvanced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState("direct");
  const [parentRakhiId, setParentRakhiId] = useState("");
  const songInput = useRef<HTMLInputElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const styleParam = params.get("style");
    const recipientParam = params.get("recipient");
    const initialSource = params.get("source") || "direct";
    const timer = window.setTimeout(() => {
      if (styleParam && STYLES.some((item) => item.id === styleParam)) setStyle(styleParam as RakhiStyle);
      if (recipientParam && RECIPIENTS.some((item) => item.id === recipientParam)) setRecipientType(recipientParam as RecipientType);
      setSource(initialSource);
      setParentRakhiId(params.get("parent") || "");
    }, 0);
    if (!started.current) {
      started.current = true;
      trackFunnel("create_started", { source: initialSource, is_recipient_loop: initialSource === "recipient_loop" });
    }
    return () => window.clearTimeout(timer);
  }, []);

  function advance() {
    if (step === 1 && !recipientName.trim()) {
      setError("Add their name to continue.");
      return;
    }
    if (step === 3 && !message.trim()) {
      setError("Add a message to continue.");
      return;
    }
    setError(null);
    trackFunnel("create_step_completed", { step, recipient_type: recipientType, template: style, source });
    setStep((value) => Math.min(4, value + 1));
  }

  async function handleGenerate() {
    if (!recipientName.trim() || !message.trim()) {
      setError("Add their name and a message before creating your Rakhi.");
      trackFunnel("generation_failed", { error_code: "validation", recipient_type: recipientType });
      return;
    }
    if (!isValidUpi(upiId)) {
      setError("Enter a valid UPI ID or 10-digit mobile number.");
      trackFunnel("generation_failed", { error_code: "validation", recipient_type: recipientType });
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const id = await createRakhi({
        style, threadColor, beadColor, charm, name, message: message.trim(),
        recipientName: recipientName.trim(), recipientType,
        ...(senderName.trim() ? { senderName: senderName.trim() } : {}),
        ...(source ? { source } : {}),
        ...(parentRakhiId ? { parentRakhiId } : {}),
        ...(songName && songDataUrl ? { songName, songDataUrl } : {}),
        ...(spotifyEmbedUrl ? { spotifyEmbedUrl } : {}),
        ...(upiId ? { upiId: normalizeUpi(upiId) } : {}),
      });
      setLink(`${window.location.origin}/r/${id}`);
      trackFunnel("rakhi_generated", {
        recipient_type: recipientType, template: style, source,
        has_song: Boolean(songName || spotifyEmbedUrl), has_upi: Boolean(upiId),
        is_recipient_loop: source === "recipient_loop",
        storage_mode: id.startsWith("v2_") || id.startsWith("v1_") ? "embedded" : "firebase",
      });
    } catch {
      setError("We couldn't create your Rakhi. Your design is safe, so please try again.");
      trackFunnel("generation_failed", { error_code: "storage", recipient_type: recipientType });
    } finally {
      setSubmitting(false);
    }
  }

  if (link) {
    const shareText = `${senderName.trim() || "Someone"} made you a Rakhi surprise. Tap to open: ${link}`;
    return (
      <div className="flex-1 flex flex-col bg-paper">
        <Header />
        <main className="page-shell flex-1 grid place-items-center py-12">
          <section className="soft-shell w-full max-w-2xl p-7 sm:p-12 text-center shadow-[0_20px_70px_-30px_rgba(185,28,44,0.28)]">
            <p className="text-xs tracking-[0.22em] uppercase text-lacquer">Ready to send</p>
            <h1 className="font-display text-4xl sm:text-5xl text-ink mt-3">Your Rakhi is ready</h1>
            <p className="mt-3 text-ink/60">Send it to {recipientName}. It opens as a gift on any phone.</p>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank" rel="noreferrer"
              onClick={() => trackFunnel("whatsapp_share_clicked", { recipient_type: recipientType, template: style, source })}
              className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-[#16883f] px-8 text-white font-semibold transition hover:bg-[#117035] active:scale-[0.98]"
            >Share on WhatsApp</a>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => navigator.clipboard.writeText(link)} className="rounded-full border border-lacquer/25 px-5 py-2.5 text-sm text-lacquer hover:bg-lacquer-soft">Copy link</button>
              {typeof navigator !== "undefined" && !!navigator.share && (
                <button type="button" onClick={() => { trackFunnel("native_share_clicked", { recipient_type: recipientType, source }); navigator.share({ title: "A Rakhi surprise", text: shareText, url: link }).catch(() => {}); }} className="rounded-full border border-lacquer/25 px-5 py-2.5 text-sm text-lacquer hover:bg-lacquer-soft">More options</button>
              )}
              <a href={link} className="rounded-full border border-lacquer/25 px-5 py-2.5 text-sm text-lacquer hover:bg-lacquer-soft">Preview gift</a>
            </div>
            {!isFirebaseConfigured() && <p className="mt-5 text-xs text-ink/45">This link contains the design so it still works across phones. Uploaded audio stays on this device.</p>}
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-paper">
      <Header />
      <main className="page-shell pb-12 pt-2">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-lacquer font-medium">{step} of 4</p>
            <h1 className="font-display text-3xl sm:text-4xl text-ink">Make their Rakhi surprise</h1>
          </div>
          <div className="hidden sm:flex gap-1" aria-label={`Step ${step} of 4`}>
            {[1, 2, 3, 4].map((item) => <span key={item} className={`h-1.5 w-10 rounded-full ${item <= step ? "bg-lacquer" : "bg-ink/10"}`} />)}
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] gap-6 lg:gap-8 items-start">
          <div className="lg:sticky lg:top-4"><RakhiStage style={style} threadColor={threadColor} beadColor={beadColor} charm={charm} initial={name || recipientName.slice(0, 1)} /></div>
          <section className="soft-shell p-6 sm:p-8 shadow-[0_16px_48px_-20px_rgba(185,28,44,0.12)]">
            {step === 1 && <div className="space-y-6">
              <div><h2 className="font-display text-3xl text-ink">Who is it for?</h2><p className="mt-2 text-sm text-ink/60">We will shape the message and opening around them.</p></div>
              <div className="grid grid-cols-2 gap-3">{RECIPIENTS.map((item) => <button key={item.id} type="button" onClick={() => setRecipientType(item.id)} className={`rounded-[1.25rem] border p-4 text-left font-medium transition active:scale-[0.98] ${recipientType === item.id ? "border-lacquer bg-lacquer-soft text-lacquer-deep" : "border-ink/10 bg-white text-ink hover:border-lacquer/25"}`}>{item.label}</button>)}</div>
              <div><label htmlFor="recipient-name" className="block text-sm font-medium text-ink">Their name</label><input id="recipient-name" autoFocus value={recipientName} onChange={(e) => setRecipientName(e.target.value.slice(0, 40))} className="mt-2 block w-full rounded-[1rem] border border-ink/15 bg-white px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-lacquer/30" /></div>
              <div><label htmlFor="sender-name" className="block text-sm font-medium text-ink">Your name <span className="font-normal text-ink/50">(optional)</span></label><input id="sender-name" value={senderName} onChange={(e) => setSenderName(e.target.value.slice(0, 40))} className="mt-2 block w-full rounded-[1rem] border border-ink/15 bg-white px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-lacquer/30" /></div>
            </div>}

            {step === 2 && <div className="space-y-6">
              <div><h2 className="font-display text-3xl text-ink">Choose their Rakhi</h2><p className="mt-2 text-sm text-ink/60">Start with a finished design. You can personalize every detail later.</p></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{STYLES.map((item, index) => <button key={item.id} type="button" onClick={() => setStyle(item.id)} className={`rounded-[1.25rem] border p-3 text-left transition active:scale-[0.98] ${style === item.id ? "border-lacquer bg-white ring-1 ring-lacquer/25" : "border-ink/10 bg-white/70 hover:border-lacquer/25"}`}><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-paper"><RakhiSVG style={item.id} threadColor="#B91C2C" beadColor="#E4C878" charm={STYLE_CHARMS[index]} initial="R" className="h-12 w-12" /></span><span className="mt-2 block text-sm font-medium text-ink">{item.label}</span></button>)}</div>
            </div>}

            {step === 3 && <div className="space-y-6">
              <div><h2 className="font-display text-3xl text-ink">Say what matters</h2><p className="mt-2 text-sm text-ink/60">Choose a starting point, then make it sound like you.</p></div>
              <div className="flex flex-wrap gap-2">{MESSAGE_TEMPLATES.map((item) => <button key={item.label} type="button" onClick={() => setMessage(item.text)} className="rounded-full border border-lacquer/20 bg-white px-4 py-2 text-sm text-lacquer hover:bg-lacquer-soft">{item.label}</button>)}</div>
              <div><label htmlFor="message" className="block text-sm font-medium text-ink">Your message</label><textarea id="message" value={message} onChange={(e) => setMessage(e.target.value.slice(0, 200))} rows={5} className="mt-2 block w-full rounded-[1.25rem] border border-ink/15 bg-white px-4 py-3 text-ink resize-none focus:outline-none focus:ring-2 focus:ring-lacquer/30" /><p className="mt-1 text-right text-xs text-ink/45">{message.length} / 200</p></div>
            </div>}

            {step === 4 && <div className="space-y-6">
              <div><h2 className="font-display text-3xl text-ink">Ready to make the moment?</h2><p className="mt-2 text-sm text-ink/60">We will create a link for {recipientName}. No signup required.</p></div>
              <div className="rounded-[1.25rem] bg-white border border-ink/10 p-5"><p className="text-sm text-ink/50">For {recipientName}</p><p className="mt-2 font-display italic text-xl text-ink">“{message}”</p><p className="mt-3 text-sm text-ink/50">{STYLES.find((item) => item.id === style)?.label}{senderName ? `, from ${senderName}` : ""}</p></div>
              <button type="button" onClick={() => { setAdvanced((value) => !value); if (!advanced) trackFunnel("advanced_customization_opened", { recipient_type: recipientType, template: style, source }); }} className="text-sm font-medium text-lacquer underline underline-offset-4">{advanced ? "Hide extra personalization" : "Personalize colors, charm, song or shagun"}</button>
              {advanced && <div className="space-y-6 border-t border-ink/10 pt-6">
                <div className="grid grid-cols-2 gap-5"><div><label className="text-sm font-medium text-ink">Thread color</label><Swatches colors={THREAD_SWATCHES} value={threadColor} onChange={setThreadColor} /></div><div><label className="text-sm font-medium text-ink">Bead color</label><Swatches colors={BEAD_SWATCHES} value={beadColor} onChange={setBeadColor} /></div></div>
                <div><label className="text-sm font-medium text-ink">Charm</label><div className="mt-2 flex flex-wrap gap-2">{CHARMS.map((item) => <button key={item.id} type="button" onClick={() => setCharm(item.id)} className={`rounded-full border px-4 py-2 text-sm ${charm === item.id ? "border-lacquer bg-lacquer-soft text-lacquer" : "border-ink/10 bg-white text-ink/70"}`}>{CHARM_ICON[item.id]} {item.label}</button>)}</div>{charm === "initial" && <input aria-label="Rakhi initial" maxLength={1} value={name} onChange={(e) => setName(e.target.value.slice(0, 1))} className="mt-3 w-16 rounded-full border border-ink/15 bg-white px-3 py-2 text-center" />}</div>
                <div><label htmlFor="spotify" className="block text-sm font-medium text-ink">Spotify song <span className="font-normal text-ink/50">(optional)</span></label><input id="spotify" type="url" value={spotifyInput} onChange={(e) => { const value = e.target.value; setSpotifyInput(value); const embed = toSpotifyEmbedUrl(value); setSpotifyEmbedUrl(embed); if (embed) { setSongName(null); setSongDataUrl(null); setError(null); } }} onBlur={() => spotifyInput.trim() && !toSpotifyEmbedUrl(spotifyInput) && setError("That does not look like a Spotify link.")} placeholder="Paste a Spotify link" className="mt-2 block w-full rounded-[1rem] border border-ink/15 bg-white px-4 py-3 text-sm" /></div>
                <div><input ref={songInput} type="file" accept="audio/*" className="sr-only" onChange={async (e) => { const file = e.target.files?.[0]; e.target.value = ""; if (!file) return; if (file.size > MAX_SONG_BYTES) { setError("Keep the audio file under 2.5 MB."); return; } try { setSongDataUrl(await fileToDataUrl(file)); setSongName(file.name); setSpotifyInput(""); setSpotifyEmbedUrl(null); } catch { setError("We couldn't read that audio file."); } }} /><button type="button" onClick={() => songInput.current?.click()} className="rounded-full border border-lacquer/25 px-4 py-2 text-sm text-lacquer">{songName ? "Change audio file" : "Attach audio file"}</button><p className="mt-2 text-xs text-ink/50">Uploaded audio stays on this device. Use Spotify if the song should travel with the link.</p></div>
                <div><label htmlFor="upi" className="block text-sm font-medium text-ink">UPI for shagun <span className="font-normal text-ink/50">(optional)</span></label><input id="upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@upi or 9876543210" className="mt-2 block w-full rounded-[1rem] border border-ink/15 bg-white px-4 py-3 text-sm" /></div>
              </div>}
            </div>}

            {error && <p role="alert" className="mt-5 text-sm font-medium text-lacquer">{error}</p>}
            <div className="mt-8 flex items-center gap-3">
              {step > 1 && <button type="button" onClick={() => { setError(null); setStep((value) => value - 1); }} className="rounded-full border border-ink/15 px-5 py-3 text-sm text-ink hover:bg-white">Back</button>}
              {step < 4 ? <button type="button" onClick={advance} className="btn-pill flex-1">Continue</button> : <button type="button" onClick={handleGenerate} disabled={submitting} className="btn-pill flex-1 disabled:opacity-60">{submitting ? "Creating your link..." : "Create Rakhi link"}</button>}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
