"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { flushSync } from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import Rakhi3D from "./Rakhi3D";
import { SpotlightRig } from "./lights";
import type { RakhiConfig } from "@/lib/rakhi";
import { loadSong } from "@/lib/songStore";
import WristPhotoStudio from "@/components/photo/WristPhotoStudio";
import { trackFunnel } from "@/lib/analytics";

type RevealLayout = {
  boxScale: number;
  rakhiScale: number;
  fov: number;
  idleCam: [number, number, number];
  finalCam: [number, number, number];
  lookIdleY: number;
  riseY: number;
  boxDropY: number;
  boxIdleOffset: number;
};

const DESKTOP_LAYOUT: RevealLayout = {
  boxScale: 1.4,
  rakhiScale: 0.58,
  fov: 46,
  idleCam: [0, -0.08, 4.2],
  finalCam: [0, 0.65, 4.15],
  lookIdleY: -0.58,
  riseY: 0.82,
  boxDropY: -0.42,
  boxIdleOffset: -0.38,
};

const MOBILE_LAYOUT: RevealLayout = {
  boxScale: 0.92,
  rakhiScale: 0.42,
  fov: 52,
  idleCam: [0, 0.0, 3.8],
  finalCam: [0, 0.38, 4.4],
  lookIdleY: -0.5,
  riseY: 0.6,
  boxDropY: -0.28,
  boxIdleOffset: -0.36,
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

function GiftBox() {
  const lacquer = "#B91C2C";
  const gold = "#D9A93E";
  return (
    <group>
      <mesh position={[0, -0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 1.1, 1.7]} />
        <meshStandardMaterial color={lacquer} metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[0.28, 1.12, 1.72]} />
        <meshStandardMaterial color={gold} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[1.72, 1.12, 0.28]} />
        <meshStandardMaterial color={gold} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

type SceneProps = {
  rakhi: RakhiConfig;
  play: boolean;
  layout: RevealLayout;
  onRevealed: () => void;
};

function Scene({ rakhi, play, layout, onRevealed }: SceneProps) {
  const boxGroup = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  const riser = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const spinning = useRef(false);
  const target = useRef(new THREE.Vector3(0, layout.riseY * 0.6, 0));
  const idleY = useRef(0);

  useFrame(() => {
    if (!play) {
      idleY.current = Math.sin(performance.now() / 1000 * 1.2) * 0.06;
      if (boxGroup.current) boxGroup.current.position.y = idleY.current + layout.boxIdleOffset;
      camera.lookAt(0, layout.lookIdleY, 0);
      return;
    }
    if (spinning.current && riser.current) {
      riser.current.rotation.y += 0.01;
    }
    camera.lookAt(target.current);
  });

  useEffect(() => {
    if (!play || !boxGroup.current || !hinge.current || !riser.current) return;

    const box = boxGroup.current;
    const lid = hinge.current;
    const rakhiGroup = riser.current;

    rakhiGroup.visible = false;
    rakhiGroup.position.y = -1.35;
    lid.rotation.x = 0;
    spinning.current = false;
    target.current.y = layout.riseY * 0.6;

    if (prefersReducedMotion()) {
      box.position.y = layout.boxDropY;
      lid.rotation.x = -2.2;
      rakhiGroup.visible = true;
      rakhiGroup.position.y = layout.riseY;
      spinning.current = true;
      camera.position.set(...layout.finalCam);
      target.current.set(0, layout.riseY, 0);
      camera.lookAt(target.current);
      onRevealed();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        spinning.current = true;
      },
    });

    tl.to(box.position, {
      y: layout.boxDropY,
      duration: 1.7,
      ease: "power2.inOut",
    });

    tl.to(lid.rotation, {
      x: -2.35,
      duration: 2.4,
      ease: "power2.inOut",
    }, "+=0.2");

    tl.add(() => {
      rakhiGroup.visible = true;
    });
    tl.to(rakhiGroup.position, {
      y: layout.riseY,
      duration: 4.2,
      ease: "power3.out",
    }, "+=0.15");

    tl.to(
      target.current,
      { y: layout.riseY, duration: 4.2, ease: "power3.out" },
      "<"
    );

    tl.to(
      camera.position,
      {
        x: layout.finalCam[0],
        y: layout.finalCam[1],
        z: layout.finalCam[2],
        duration: 4.4,
        ease: "power3.inOut",
      },
      "<0.2"
    );

    tl.add(() => onRevealed(), "+=0.25");

    return () => {
      tl.kill();
      spinning.current = false;
    };
  }, [play, camera, onRevealed, layout]);

  return (
    <>
      <SpotlightRig />
      <group ref={boxGroup} scale={layout.boxScale}>
        <GiftBox />
        <group ref={riser} position={[0, -1.35, 0]} visible={false}>
          <group scale={layout.rakhiScale}>
            <Rakhi3D
              style={rakhi.style}
              threadColor={rakhi.threadColor}
              beadColor={rakhi.beadColor}
              charm={rakhi.charm}
              initial={rakhi.name}
            />
          </group>
        </group>
        <group ref={hinge} position={[0, 0.02, -0.85]}>
          <mesh position={[0, 0, 0.85]} castShadow>
            <boxGeometry args={[1.82, 0.26, 1.82]} />
            <meshStandardMaterial color="#B91C2C" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.02, 0.85]}>
            <boxGeometry args={[0.3, 0.28, 1.84]} />
            <meshStandardMaterial color="#D9A93E" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </>
  );
}

function RevealCanvas({
  rakhi,
  play,
  layout,
  onRevealed,
}: {
  rakhi: RakhiConfig;
  play: boolean;
  layout: RevealLayout;
  onRevealed: () => void;
}) {
  const dpr = layout.fov < 44 ? 1.75 : 2;
  return (
    <Canvas shadows dpr={[1, dpr]} className="!h-full !w-full touch-none" style={{ touchAction: "none" }}>
      <color attach="background" args={["#121014"]} />
      <PerspectiveCamera makeDefault position={layout.idleCam} fov={layout.fov} />
      <Suspense fallback={null}>
        <Scene rakhi={rakhi} play={play} layout={layout} onRevealed={onRevealed} />
      </Suspense>
    </Canvas>
  );
}

function spotifyAutoplaySrc(embedUrl: string): string {
  try {
    const u = new URL(embedUrl);
    u.searchParams.set("autoplay", "1");
    if (!u.searchParams.has("theme")) u.searchParams.set("theme", "0");
    return u.toString();
  } catch {
    const join = embedUrl.includes("?") ? "&" : "?";
    return `${embedUrl}${join}autoplay=1`;
  }
}

function buildUpiLink(upiId: string): string {
  let vpa = upiId;
  if (!upiId.includes("@")) {
    // Bare mobile number: NPCI's "UPI Number" format needs the country code,
    // e.g. 9959041832 -> 919959041832@upi. A 10-digit number alone won't resolve.
    const digits = upiId.replace(/\D/g, "");
    const withCountryCode = digits.length === 10 ? `91${digits}` : digits;
    vpa = `${withCountryCode}@upi`;
  }
  const pa = encodeURIComponent(vpa);
  return `upi://pay?pa=${pa}&tn=Shagun%20for%20Raksha%20Bandhan&cu=INR`;
}

export default function GiftBoxReveal({ rakhi, autoPlay = false }: { rakhi: RakhiConfig; autoPlay?: boolean }) {
  const isMobile = useIsMobile();
  const layout = isMobile ? MOBILE_LAYOUT : DESKTOP_LAYOUT;

  const [play, setPlay] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showPhotoStudio, setShowPhotoStudio] = useState(false);
  const [songUrl, setSongUrl] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [showSpotify, setShowSpotify] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spotifyRef = useRef<HTMLIFrameElement | null>(null);
  const revealTracked = useRef(false);
  const hasSong = Boolean(rakhi.songName || rakhi.spotifyEmbedUrl);

  useEffect(() => {
    if (autoPlay) return;
    trackFunnel("gift_loaded", {
      recipient_type: rakhi.recipientType,
      template: rakhi.style,
      source: rakhi.source || "shared_link",
      has_song: hasSong,
      has_upi: Boolean(rakhi.upiId),
      is_recipient_loop: rakhi.source === "recipient_loop",
    });
  }, [autoPlay, rakhi.recipientType, rakhi.style, rakhi.source, rakhi.upiId, hasSong]);

  useEffect(() => {
    if (!rakhi.songName) return;
    let cancelled = false;
    loadSong(rakhi.id).then((song) => {
      if (!cancelled && song?.dataUrl) setSongUrl(song.dataUrl);
    });
    return () => { cancelled = true; };
  }, [rakhi.id, rakhi.songName]);

  const openGift = useCallback(() => {
    setPlay(true);
    if (!autoPlay) trackFunnel("gift_opened", { recipient_type: rakhi.recipientType, template: rakhi.style, source: rakhi.source || "shared_link" });

    const audio = audioRef.current;
    if (audio && songUrl) {
      audio.currentTime = 0;
      void audio.play().catch(() => {});
    }

    if (rakhi.spotifyEmbedUrl) {
      flushSync(() => setShowSpotify(true));
      const frame = spotifyRef.current;
      if (frame) {
        frame.src = spotifyAutoplaySrc(rakhi.spotifyEmbedUrl);
      }
    }
  }, [autoPlay, rakhi.recipientType, rakhi.source, rakhi.spotifyEmbedUrl, rakhi.style, songUrl]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = window.setTimeout(openGift, 650);
    return () => window.clearTimeout(timer);
  }, [autoPlay, openGift]);

  useEffect(() => {
    const audio = audioRef.current;
    if (play && audio && songUrl) {
      audio.currentTime = 0;
      void audio.play().catch((err) => {
        console.warn("Audio playback was blocked or failed:", err);
      });
    }
  }, [play, songUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (!revealed) {
      setTypedMessage("");
      setTypingDone(false);
      return;
    }
    const full = rakhi.message;
    if (prefersReducedMotion()) {
      setTypedMessage(full);
      setTypingDone(true);
      return;
    }
    setTypedMessage("");
    setTypingDone(false);
    let i = 0;
    const speed = Math.max(28, Math.min(55, 1400 / Math.max(full.length, 1)));
    const id = window.setInterval(() => {
      i += 1;
      setTypedMessage(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(id);
        setTypingDone(true);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [revealed, rakhi.message]);

  return (
    <main className="relative w-full h-[100dvh] bg-plum overflow-hidden flex flex-col">
      {songUrl && <audio ref={audioRef} src={songUrl} loop preload="auto" />}

      {rakhi.spotifyEmbedUrl && (
        <div
          className={`absolute top-safe right-4 left-4 sm:left-auto z-20 sm:w-[340px] pt-safe transition-opacity duration-500 ${
            showSpotify ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={!showSpotify}
        >
          <iframe
            ref={spotifyRef}
            title="Spotify song"
            src="about:blank"
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="rounded-xl overflow-hidden shadow-2xl border border-cream-ink/10 bg-plum"
          />
        </div>
      )}

      <div className="absolute inset-0 w-full h-full z-0">
        <RevealCanvas
          rakhi={rakhi}
          play={play}
          layout={layout}
          onRevealed={() => {
            setRevealed(true);
            if (!autoPlay && !revealTracked.current) {
              revealTracked.current = true;
              trackFunnel("gift_revealed", { recipient_type: rakhi.recipientType, template: rakhi.style, source: rakhi.source || "shared_link" });
            }
          }}
        />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col pointer-events-none select-none">

        {/* Before opening */}
        {!play && (
          <div className="flex-1 flex flex-col items-center justify-end px-5 pb-safe gap-4" style={{ paddingBottom: "max(5rem, env(safe-area-inset-bottom, 1.25rem) + 4rem)" }}>
            <div className="flex flex-col items-center gap-1.5 pointer-events-auto text-center hero-shadow">
              <p className="text-cream-ink text-base sm:text-xl font-medium drop-shadow leading-snug">
                {rakhi.recipientName || rakhi.name ? (
                  <><span className="font-display italic text-lacquer-bright">{rakhi.recipientName || rakhi.name}</span>, you</>
                ) : "You"} received a rakhi
              </p>
              {rakhi.senderName && <p className="text-cream-ink/60 text-xs sm:text-sm">Made for you by {rakhi.senderName}</p>}
              {hasSong && (
                <p className="text-cream-ink/60 text-xs sm:text-sm font-display italic">
                  🎵 Includes a song
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={openGift}
              className="btn-pill shadow-2xl w-full max-w-[280px] pointer-events-auto text-base py-4 transition active:scale-95"
            >
              Tap to open
            </button>
          </div>
        )}

        {/* After opening — message + accept */}
        {play && !accepted && (
          <div className="flex-1 flex flex-col items-center justify-end px-5 gap-4" style={{ paddingBottom: "max(4rem, env(safe-area-inset-bottom, 1.25rem) + 3rem)" }}>
            <section
              className={`w-full max-w-sm flex flex-col items-center gap-4 text-center transition-all duration-700 ease-out pointer-events-auto ${
                revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
              }`}
            >
              <p className="text-cream-ink text-lg sm:text-2xl leading-relaxed drop-shadow font-display italic px-2 min-h-[1.5em]">
                &ldquo;{typedMessage}
                {!typingDone && (
                  <span className="inline-block w-[0.08em] h-[0.9em] ml-0.5 align-[-0.1em] bg-lacquer-bright animate-pulse" aria-hidden />
                )}
                &rdquo;
              </p>

              <div
                className={`flex flex-col sm:flex-row items-center gap-3 w-full justify-center transition-opacity duration-700 ${
                  typingDone ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {songUrl && (
                  <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-cream-ink/25 text-cream-ink/70 text-sm px-5 py-3 min-h-[48px] hover:bg-cream-ink/10 active:bg-cream-ink/20 transition touch-manipulation"
                  >
                    {muted ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                      </svg>
                    )}
                    {muted ? "Unmute" : "Mute"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setAccepted(true);
                    trackFunnel("gift_accepted", { recipient_type: rakhi.recipientType, template: rakhi.style, source: rakhi.source || "shared_link" });
                  }}
                  className="btn-pill w-full sm:w-auto inline-flex items-center justify-center gap-2 text-center transition active:scale-95 touch-manipulation min-h-[48px]"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Accept this Rakhi
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Accepted */}
        {accepted && (
          <div className="flex-1 flex flex-col items-center justify-end px-5 gap-4" style={{ paddingBottom: "max(4rem, env(safe-area-inset-bottom, 1.25rem) + 3rem)" }}>
            <section className="w-full max-w-xs flex flex-col items-center gap-5 text-center pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <p className="text-cream-ink text-xl sm:text-2xl font-display italic drop-shadow">
                Rakhi accepted!
              </p>
              <div className="flex flex-col items-stretch gap-2.5 w-full">
                {rakhi.upiId && (
                  <a
                    href={buildUpiLink(rakhi.upiId)}
                    onClick={() => trackFunnel("shagun_clicked", { recipient_type: rakhi.recipientType, template: rakhi.style, source: rakhi.source || "shared_link" })}
                    className="btn-pill inline-flex items-center justify-center gap-2.5 text-center transition active:scale-95 touch-manipulation min-h-[52px] text-sm font-semibold"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Send shagun
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowPhotoStudio(true);
                    trackFunnel("wrist_photo_started", { recipient_type: rakhi.recipientType, template: rakhi.style, source: rakhi.source || "shared_link" });
                  }}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-cream-ink/12 border border-cream-ink/20 text-cream-ink text-sm font-medium px-5 min-h-[52px] hover:bg-cream-ink/18 active:bg-cream-ink/25 transition touch-manipulation"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  Wear it for real
                </button>
                {songUrl && (
                  <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    className="inline-flex items-center justify-center gap-2.5 rounded-full border border-cream-ink/20 text-cream-ink/60 text-sm px-5 min-h-[48px] hover:bg-cream-ink/10 active:bg-cream-ink/18 transition touch-manipulation"
                  >
                    {muted ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                      </svg>
                    )}
                    {muted ? "Unmute song" : "Mute song"}
                  </button>
                )}
                <a
                  href={`/create?style=${encodeURIComponent(rakhi.style)}&source=recipient_loop${rakhi.id.startsWith("v1_") || rakhi.id.startsWith("v2_") ? "" : `&parent=${encodeURIComponent(rakhi.id)}`}`}
                  onClick={() => trackFunnel("recipient_create_clicked", { recipient_type: rakhi.recipientType, template: rakhi.style, source: "recipient_loop", is_recipient_loop: true })}
                  className="btn-pill inline-flex items-center justify-center gap-2.5 text-sm min-h-[52px] transition active:scale-95 touch-manipulation"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  Create one for your sibling
                </a>
              </div>
              {rakhi.upiId && (
                <p className="text-cream-ink/35 text-xs">
                  UPI: <span className="font-mono">{rakhi.upiId}</span>
                </p>
              )}
            </section>
          </div>
        )}

      </div>

      {showPhotoStudio && (
        <WristPhotoStudio rakhi={rakhi} onClose={() => setShowPhotoStudio(false)} />
      )}
    </main>
  );
}
