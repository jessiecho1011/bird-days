import React from 'react';
import { Film } from 'lucide-react';
import { parseVideoUrl } from '../../utils/media';

interface VideoPlayerProps {
  url?: string;
  title?: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title = '商品介紹影片',
  className = '',
}) => {
  const parsed = parseVideoUrl(url);

  if (parsed.type === 'invalid') {
    return (
      <div
        className={`surface-warm flex flex-col items-center justify-center p-8 text-center text-text-muted ${className}`}
      >
        <Film className="mb-2 h-8 w-8 text-brand-accent" />
        <p className="text-sm font-medium">目前尚未設定有效的介紹影片連結</p>
      </div>
    );
  }

  if (parsed.type === 'iframe') {
    return (
      <div
        className={`overflow-hidden rounded-2xl border border-border-soft bg-bg-dark aspect-video ${className}`}
      >
        <iframe
          src={parsed.embedUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border-soft bg-bg-dark aspect-video ${className}`}
    >
      <video src={parsed.src} controls className="h-full w-full object-contain">
        您的瀏覽器不支援影片播放。
      </video>
    </div>
  );
};

