import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const isEmbeddableUrl = (url) => {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com");
};

const getEmbedUrl = (src, autoplay = 0) => {
  const videoId = getYouTubeVideoId(src);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&mute=1&controls=1&modestbranding=1`;
  }
  
  if (src.includes("vimeo.com")) {
    const vimeoId = src.match(/vimeo\.com\/(\d+)/)?.[1];
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=${autoplay}&muted=1`;
    }
  }
  
  return null;
};

const MyVideos = () => {
  const feedRef = useRef(null);
  const iframeRefs = useRef([]);
  const videoRefs = useRef([]);
  const [videos, setVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("https://easybrand.onrender.com/api/page-data/videos");
        const data = await response.json();

        const savedVideos = Array.isArray(data?.videos) ? data.videos : [];
        const normalizedVideos = savedVideos
          .filter((video) => typeof video?.url === "string" && video.url.trim().length > 0)
          .map((video) => ({
            name: video.title || "Happy Zimba video",
            subtitle: "Happy Zimba",
            src: video.url,
          }));

        setVideos(normalizedVideos);
      } catch (error) {
        console.error("Failed to load videos:", error);
        setVideos([]);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed || !videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;

        const index = Number(visibleEntry.target.dataset.index);
        setActiveIndex(index);
      },
      {
        root: feed,
        threshold: [0.5, 0.7, 0.9],
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos.length]);

  useEffect(() => {
    if (!videos.length) return;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (typeof video.play !== "function" || typeof video.pause !== "function") {
        return;
      }

      if (index === activeIndex) {
        video.muted = false;
        video.play().catch(() => {});
      } else {
        video.muted = true;
        video.pause();
        video.currentTime = 0;
      }
    });

    // Handle iframe autoplay by updating src
    iframeRefs.current.forEach((iframe, index) => {
      if (!iframe) return;

      const video = videos[index];
      const isEmbeddable = isEmbeddableUrl(video.src);
      if (!isEmbeddable) return;

      const embedUrl = getEmbedUrl(video.src, index === activeIndex ? 1 : 0);
      if (embedUrl && iframe.src !== embedUrl) {
        iframe.src = embedUrl;
      }
    });
  }, [activeIndex]);

  const handleVideoClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const video = videos[activeIndex];
    if (!video) return;

    const isEmbeddable = isEmbeddableUrl(video.src);

    if (event && event.target) {
      event.target.blur?.();
    }

    // For iframes, we cannot directly control play/pause due to cross-origin restrictions
    // The iframe controls are available to the user
    if (isEmbeddable) {
      setIsPaused(!isPaused);
      return;
    }

    // For direct video tags, toggle play/pause
    const videoEl = videoRefs.current[activeIndex];
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play().catch(() => {});
      setIsPaused(false);
    } else {
      videoEl.pause();
      setIsPaused(true);
    }
  };

  const goToVideo = (direction) => {
    if (!feedRef.current) return;

    const scrollAmount = feedRef.current.clientHeight * direction;
    feedRef.current.scrollBy({
      top: scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!videos.length || activeIndex >= videos.length) {
      return;
    }

    const video = videos[activeIndex];
    const isEmbeddable = isEmbeddableUrl(video.src);

    if (isEmbeddable) {
      // For iframes, we can't detect pause state, so don't update
      return;
    }

    const videoEl = videoRefs.current[activeIndex];
    if (!videoEl) return;

    setIsPaused(videoEl.paused);
  }, [activeIndex]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f7f7f5] p-0 sm:p-6 select-none cursor-default" style={{ WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}>
      <div className="relative w-full sm:w-auto">
        <div className="pointer-events-none absolute right-[-52px] top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
          <button
            type="button"
            aria-label="Previous video"
            onClick={() => goToVideo(-1)}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-xl text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60"
          >
           <ChevronUp size={24}/>
          </button>
          <button
            type="button"
            aria-label="Next video"
            onClick={() => goToVideo(1)}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-xl text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronDown size={24} />
          </button>
        </div>

        <div
          ref={feedRef}
          className="h-screen w-full overflow-y-auto snap-y snap-mandatory bg-black scroll-smooth sm:h-[85dvh] sm:w-[360px] sm:rounded-[28px] sm:shadow-[0_25px_70px_rgba(15,23,42,0.22)] select-none"
          style={{ scrollbarWidth: "none", touchAction: "pan-y", WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
        >
        {videos.length === 0 ? (
          <div className="flex h-screen w-full items-center justify-center bg-black text-white sm:h-[85dvh] sm:w-[360px] sm:rounded-[28px]">
            <p className="text-sm text-white/70">No videos available yet.</p>
          </div>
        ) : videos.map((video, index) => {
          const isEmbeddable = isEmbeddableUrl(video.src);
          const embedUrl = isEmbeddable ? getEmbedUrl(video.src, 0) : null;

          return (
            <section
              key={`${video.name}-${index}`}
              className="relative h-screen snap-start snap-always bg-black sm:h-[85dvh] select-none outline-none focus:outline-none cursor-default"
              onClick={index === activeIndex ? handleVideoClick : undefined}
              style={{ WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none", touchAction: "pan-y" }}
            >
              {isEmbeddable && embedUrl ? (
                <iframe
                  ref={(el) => {
                    iframeRefs.current[index] = el;
                  }}
                  src={embedUrl}
                  title={video.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full object-cover bg-black border-0"
                  style={{ WebkitUserSelect: "none", userSelect: "none", touchAction: "pan-y" }}
                />
              ) : (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  data-index={index}
                  src={video.src}
                  autoPlay={index === activeIndex}
                  muted={index !== activeIndex}
                  playsInline
                  loop
                  tabIndex={-1}
                  onPause={() => index === activeIndex && setIsPaused(true)}
                  onPlay={() => index === activeIndex && setIsPaused(false)}
                  className="h-full w-full object-cover bg-black"
                  style={{ WebkitUserSelect: "none", userSelect: "none", touchAction: "pan-y" }}
                />
              )}

              {index === activeIndex && isPaused && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/15 ">
                    <div className="flex h-10 w-10 items-center justify-center">
                      <div className="h-5 w-1 rounded-full bg-white" />
                      <div className="ml-1 h-5 w-1 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-3 pb-20 sm:pb-6">
                <div className="bg-gradient-to-t from-black/75 via-black/15 to-transparent px-1 pb-2 pt-1">
                  <div className="text-white">
                    <p className="text-base font-semibold">{video.name}</p>
                    <p className="text-sm text-white/80">{video.subtitle}</p>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default MyVideos;