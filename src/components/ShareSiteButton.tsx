"use client";

const SHARE_TEXT = "Send a rakhi online this Raksha Bandhan — no shipping, just a link.";
const SHARE_URL = "https://www.makeyourrakhi.in";

export default function ShareSiteButton({ className = "" }: { className?: string }) {
  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Make Your Rakhi", text: SHARE_TEXT, url: SHARE_URL });
        return;
      } catch {
        return;
      }
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`,
      "_blank",
      "noreferrer"
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 text-xs tracking-wide link-underline ${className}`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.6" y1="10.6" x2="15.4" y2="6.4" /><line x1="8.6" y1="13.4" x2="15.4" y2="17.6" />
      </svg>
      Share with a sibling
    </button>
  );
}
