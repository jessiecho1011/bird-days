import React from 'react';

interface RichTextViewerProps {
  html: string;
  className?: string;
}

export const RichTextViewer: React.FC<RichTextViewerProps> = ({
  html,
  className = '',
}) => {
  return (
    <div
      className={`rich-text-content text-text-primary ${className}`}
      dangerouslySetInnerHTML={{ __html: html || '<p>尚無詳細介紹內容</p>' }}
    />
  );
};

