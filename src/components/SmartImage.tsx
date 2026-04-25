import { useState, useMemo, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  alt: string;
  /** Tailwind classes for the wrapper that holds the skeleton; pass aspect ratio / sizing here. */
  wrapperClassName?: string;
  /** Skeleton tone — defaults to brand mist. */
  skeletonClassName?: string;
}

/**
 * Convert an Unsplash URL to request a WebP-encoded variant.
 * Other hosts are returned unchanged; the browser still benefits from `<picture>` fallback wherever possible.
 */
function toWebpSrc(src: string): string {
  if (!src) return src;
  try {
    if (src.includes("images.unsplash.com")) {
      const url = new URL(src);
      url.searchParams.set("fm", "webp");
      if (!url.searchParams.has("auto")) url.searchParams.set("auto", "format,compress");
      if (!url.searchParams.has("q")) url.searchParams.set("q", "80");
      return url.toString();
    }
  } catch {
    /* fall through */
  }
  return src;
}

export default function SmartImage({
  src,
  alt,
  className,
  wrapperClassName,
  skeletonClassName,
  loading = "lazy",
  decoding = "async",
  onLoad,
  onError,
  ...rest
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const optimised = useMemo(() => toWebpSrc(src), [src]);

  return (
    <div className={cn("relative overflow-hidden bg-ruh-mist", wrapperClassName)}>
      {!loaded && !errored && (
        <div
          className={cn(
            "absolute inset-0 animate-pulse bg-gradient-to-br from-ruh-mist via-[hsl(36_24%_82%)] to-ruh-mist",
            skeletonClassName,
          )}
          aria-hidden="true"
        />
      )}
      <img
        src={optimised}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={cn(
          "transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setErrored(true);
          setLoaded(true);
          onError?.(e);
        }}
        {...rest}
      />
    </div>
  );
}