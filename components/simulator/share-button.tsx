import { Link as LinkIcon } from "lucide-react";
import { useState } from "react";

import type { AppState } from "@/components/simulator/types";
import { useTransientFlag } from "@/components/simulator/use-transient-flag";
import { flushUrl } from "@/components/simulator/use-url-state";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stack } from "@/components/ui/layout-primitives";

export type ShareButtonProps = {
  state: AppState;
};

export const ShareButton = ({ state }: ShareButtonProps) => {
  const [copied, flashCopied] = useTransientFlag(3000);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const handleShare = async () => {
    // flushUrl first — otherwise a 300ms-stale debounced URL gets copied
    // instead of what's on screen right now.
    const url = flushUrl(state);
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(url);
      setFallbackUrl(null);
      flashCopied();
    } catch {
      // Covers both permission denial and an insecure (non-https/non-localhost)
      // context, which surface differently but both need the same fallback.
      setFallbackUrl(url);
    }
  };

  return (
    <Stack gap={2}>
      <Button variant="ghost" onClick={handleShare}>
        <LinkIcon aria-hidden />
        Поделиться
      </Button>
      {copied && <Alert tone="ok">Ссылка скопирована</Alert>}
      {fallbackUrl && (
        <Input
          readOnly
          value={fallbackUrl}
          onFocus={(event) => event.currentTarget.select()}
          aria-label="Ссылка на текущий сценарий"
        />
      )}
    </Stack>
  );
};
