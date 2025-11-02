import React, {
  forwardRef, useCallback, useEffect, useImperativeHandle,
  useMemo, useRef, useState
} from "react";
import "./HackBar.css";

export type LineLevel = "info" | "warn" | "error" | "muted" | undefined;

type Job =
  | { type: "line"; line: string; level?: LineLevel }
  | { type: "raw"; html: string };

export type HackBarHandle = {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  clear: () => void;
  push: (line: string, level?: LineLevel) => void;     // optional manual inject
  pushRaw: (html: string) => void;
};

export type HackBarProps = {
  title?: string;
  badge?: string;
  cps?: number;               // characters per second
  stickinessPx?: number;
  className?: string;
  style?: React.CSSProperties;
  showChrome?: boolean;

  /** Auto-generator knobs */
  auto?: boolean;             // default true
  minDelayMs?: number;        // delay between lines
  maxDelayMs?: number;
  warnChance?: number;        // 0..1
  errorChance?: number;       // 0..1
};

const DEFAULT_CPS = 40;

export const HackBar = forwardRef<HackBarHandle, HackBarProps>(function HackBar(
  {
    title = "PROCESS MONITOR",
    badge = "LIVE",
    cps = DEFAULT_CPS,
    stickinessPx = 16,
    className,
    style,
    showChrome = true,
    auto = true,
    minDelayMs = 420,
    maxDelayMs = 720,
    warnChance = 0.08,
    errorChance = 0.04,
  },
  ref
){
  const termRef = useRef<HTMLDivElement | null>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);
  const queueRef = useRef<Job[]>([]);
  const pausedRef = useRef(false);
  const typingRef = useRef(false);
  const runningRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  // force render hook for clear()
  const [, bump] = useState(0);
  const forceRender = () => bump(n => (n+1) % 1_000_000);

  const rnd = (a:number,b:number) => a + Math.random()*(b-a);
  const pick = <T,>(arr:T[]) => arr[(Math.random()*arr.length)|0];

  // ---- Terminal plumbing
  const isStuckToBottom = useCallback(() => {
    const el = termRef.current; if (!el) return true;
    return el.scrollTop + el.clientHeight >= el.scrollHeight - stickinessPx;
  }, [stickinessPx]);

  const maybeStick = useCallback((forceSnap=false) => {
    const el = termRef.current; if (!el) return;
    if (forceSnap || isStuckToBottom()) el.scrollTop = el.scrollHeight;
  }, [isStuckToBottom]);

  const makeLineEl = useCallback((level?: LineLevel) => {
    const div = document.createElement("div");
    div.className = "line" + (level ? ` line--${level}` : "");
    div.style.textAlign = "left";
    return div;
  }, []);

  const ensureCaret = useCallback(() => {
    if (!caretRef.current) {
      const caret = document.createElement("span");
      caret.className = "caret";
      caretRef.current = caret;
    }
    return caretRef.current!;
  }, []);

  const typeInto = useCallback((el: HTMLElement, text: string, cpsLocal: number) => {
    return new Promise<void>((resolve) => {
      let i = 0;
      const charsPerFrame = Math.max(1, Math.round(cpsLocal / 60));
      let rafId = 0;
      const step = () => {
        if (pausedRef.current) { rafId = requestAnimationFrame(step); return; }
        el.textContent += text.slice(i, i + charsPerFrame);
        i += charsPerFrame;
        maybeStick(false);
        if (i >= text.length) { resolve(); return; }
        rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
      (el as any).__cancelType__ = () => cancelAnimationFrame(rafId);
    });
  }, [maybeStick]);

  const pump = useCallback(async () => {
    if (typingRef.current || pausedRef.current) return;
    typingRef.current = true;
    const term = termRef.current;
    if (!term) { typingRef.current = false; return; }

    while (!pausedRef.current && queueRef.current.length) {
      const job = queueRef.current.shift()!;
      const stick = isStuckToBottom();
      if (job.type === "line") {
        const wrapper = makeLineEl(job.level);
        const prefix = document.createElement("span");
        prefix.className = "prefix";
        prefix.textContent = "›";
        wrapper.appendChild(prefix);

        const textNode = document.createElement("span");
        wrapper.appendChild(textNode);

        const caret = ensureCaret();
        wrapper.appendChild(caret);

        term.appendChild(wrapper);
        if (stick) maybeStick(true);

        await typeInto(textNode, " " + String(job.line), cps);

        caret.remove();
        const phantom = document.createElement("div");
        phantom.className = "line line--muted";
        phantom.style.margin = "0";
        phantom.appendChild(caret);
        term.appendChild(phantom);
      } else {
        const div = document.createElement("div");
        div.className = "line";
        div.innerHTML = job.html;
        term.appendChild(div);
      }
      maybeStick(stick);
      if (!pausedRef.current) await new Promise(r => setTimeout(r, Math.floor(rnd(minDelayMs, maxDelayMs) / cps) * 120));
    }
    typingRef.current = false;
  }, [cps, ensureCaret, isStuckToBottom, makeLineEl, maybeStick, typeInto]);

  // ---- Generator
  const mkIp = () => `${(Math.random()*223|0)}.${(Math.random()*255|0)}.${(Math.random()*255|0)}.${(Math.random()*255|0)}`;
  const mkHash = () => crypto.getRandomValues(new Uint32Array(4)).reduce((s,n)=>s+n.toString(16).padStart(8,"0"),"").slice(0,32);
  const mkHex = (len:number) => Array.from(crypto.getRandomValues(new Uint8Array(len))).map(b=>b.toString(16).padStart(2,"0")).join("");
  const mkPort = () => [22,80,443,3306,5432,6379,27017,8080,9000,9443][(Math.random()*10)|0];

  const templates: Array<() => { text: string; level?: LineLevel }> = [
    () => ({ text:`Handshake complete with ${mkIp()}:${mkPort()}`, level:"info" }),
    () => ({ text:`TLS resume OK • session=${mkHex(6)}…`, level:"muted" }),
    () => ({ text:`Fetching manifest sha256:${mkHash().slice(0,12)}…`, level:"info" }),
    () => ({ text:`Pull layer ${mkHash().slice(0,10)} size=${(rnd(0.2,30)).toFixed(1)}MB`, level:"muted" }),
    () => ({ text:`watcher » ${Math.random().toString(36).slice(2,8)} ${Math.random().toString(36).slice(2,8)} ${Math.random().toString(36).slice(2,8)}` }),
    () => ({ text:`Clock skew detected Δ=${(rnd(50,420)).toFixed(0)}ms`, level:"warn" }),
    () => ({ text:`CRC mismatch on block 0x${mkHex(3)} • retry`, level:"error" }),
    () => ({ text:`OK ✓ Ready in ${(rnd(0.4,2.4)).toFixed(2)}s`, level:"info" }),
    () => ({ text:`Trace: /srv/app/hooks/post-receive:${(rnd(10,200)|0)}`, level:"muted" }),
    () => ({ text:`Auth refresh token=${mkHex(8)}…`, level:"muted" }),
  ];

  const scheduleNext = useCallback(() => {
    if (!runningRef.current) return;
    const delay = rnd(minDelayMs, maxDelayMs);
    // window.setTimeout returns number in browsers; keep typed as number
    timerRef.current = window.setTimeout(() => {
      if (!runningRef.current) return;
      const roll = Math.random();
      let level: LineLevel | undefined;
      if (roll < errorChance) level = "error";
      else if (roll < errorChance + warnChance) level = "warn";
      const t = pick(templates)();
      const finalLevel = level ?? t.level;
      queueRef.current.push({ type: "line", line: t.text, level: finalLevel });
      queueMicrotask(pump);
      scheduleNext();
    }, delay) as unknown as number;
  }, [errorChance, maxDelayMs, minDelayMs, pump, warnChance]);

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    scheduleNext();
  }, [scheduleNext]);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // public API
  useImperativeHandle(ref, () => ({
    start,
    stop,
    pause: () => { pausedRef.current = true; },
    resume: () => { if (pausedRef.current){ pausedRef.current = false; queueMicrotask(pump); } },
    clear: () => {
      stop();
      if (termRef.current) {
        termRef.current.querySelectorAll<HTMLElement>(".line span").forEach((n)=>{
          const fn = (n as any).__cancelType__ as (()=>void)|undefined;
          if (fn) fn();
        });
        termRef.current.innerHTML = "";
      }
      caretRef.current = null;
      queueRef.current = [];
      typingRef.current = false;
      forceRender();
    },
    push: (line, level) => { queueRef.current.push({ type:"line", line, level }); queueMicrotask(pump); },
    pushRaw: (html) => { queueRef.current.push({ type:"raw", html }); queueMicrotask(pump); },
  }), [pump, start, stop]);

  // auto-start
  useEffect(() => {
    if (auto) start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  const ariaProps = useMemo(()=>({ "aria-live":"polite", "aria-atomic":"false" } as const),[]);

  return (
    <aside className={["hackbar", className].filter(Boolean).join(" ")} style={style}>
        <>
          <div className="grid" aria-hidden="true" />
          <div className="hackbar__hdr">
            <span className="dot dot--r" />
            <span className="dot dot--y" />
            <span className="dot dot--g" />
            <span className="title">{title}</span>
            {badge ? <span className="badge">{badge}</span> : null}
          </div>
        </>
      <div className="hackbar__term" ref={termRef} {...ariaProps} />
      {showChrome && (
        <div className="controls">
          <button className="btn" type="button" onClick={() => pausedRef.current = true}>Pause</button>
          <button className="btn" type="button" onClick={() => { pausedRef.current = false; queueMicrotask(pump); }}>Resume</button>
          <button className="btn" type="button" onClick={() => start()}>Start</button>
          <button className="btn" type="button" onClick={() => stop()}>Stop</button>
          <button className="btn" type="button" onClick={() => {
            for (let i=0;i<5;i++) queueRef.current.push({ type:"line", line:`inject » ${mkHex(4)}.${i}` });
            queueMicrotask(pump);
          }}>Burst 5</button>
          <button className="btn" type="button" onClick={() => {
            if (termRef.current) termRef.current.innerHTML = "";
            caretRef.current = null;
          }}>Clear</button>
        </div>
      )}
    </aside>
  );
});

