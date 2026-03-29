"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Copy, Link2, Mail, Share2 } from "lucide-react";

function buildAbsoluteUrl(origin: string, pathname: string) {
  if (!origin) return "";
  return `${origin}${pathname || "/"}`;
}

export default function SocialShareLinks() {
  const pathname = usePathname();
  const [copyFeedback, setCopyFeedback] = useState("");
  const [origin, setOrigin] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  const shareUrl = useMemo(() => buildAbsoluteUrl(origin, pathname), [origin, pathname]);
  const shareText = "Explore Christian Study Guide for Bible study, prayer, and daily discipleship.";
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareTargets = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent("Christian Study Guide")}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
    },
  ];

  const handleCopy = async () => {
    if (!shareUrl) return;

    await navigator.clipboard.writeText(shareUrl);
    setCopyFeedback("Copied");
    window.setTimeout(() => setCopyFeedback(""), 1800);
  };

  const handleNativeShare = async () => {
    if (!shareUrl || !navigator.share) return;

    await navigator.share({
      title: "Christian Study Guide",
      text: shareText,
      url: shareUrl,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {canNativeShare ? (
          <button
            type="button"
            onClick={() => void handleNativeShare()}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
        >
          <Copy className="h-4 w-4" />
          {copyFeedback || "Copy link"}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {shareTargets.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
          >
            {item.label === "Email" ? <Mail className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
