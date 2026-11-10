import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color, FontSize, TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Palette,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react';
import { EDITOR_HIGHLIGHT_COLORS, EDITOR_TEXT_COLORS } from '../../config/themeKeys';
import { fileToDataUrl } from '../../utils/media';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const FONT_SIZE_OPTIONS = [
  { label: '預設字級', value: '' },
  { label: '小字 14px', value: '14px' },
  { label: '標準 16px', value: '16px' },
  { label: '中大 18px', value: '18px' },
  { label: '大字 22px', value: '22px' },
  { label: '特大 28px', value: '28px' },
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
}) => {
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
        },
      }),
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'rich-text-content min-h-[240px] px-4 py-3 text-text-primary focus:outline-none',
      },
    },
  });

  // 切換編輯目標（例如從 A 商品切到 B 商品）時同步更新內容
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="surface-warm p-4 text-sm text-text-muted">
        載入文字樣式編輯器中...
      </div>
    );
  }

  const handleAddLink = () => {
    const prevUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('請輸入超連結網址（含 https://）', prevUrl || 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url.trim() }).run();
  };

  const handleAddImageUrl = () => {
    const url = window.prompt('請貼上要插入文章內的圖片網址', 'https://');
    if (url && url.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  };

  const handleUploadInlineImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      editor.chain().focus().setImage({ src: dataUrl }).run();
    } catch {
      window.alert('圖片插入失敗，請改用較小的圖片或圖片網址。');
    } finally {
      e.target.value = '';
    }
  };

  const btnClass = (isActive = false) =>
    `inline-flex items-center justify-center rounded-lg p-1.5 text-sm transition-colors ${
      isActive
        ? 'bg-brand-primary text-text-on-primary font-semibold'
        : 'text-text-secondary hover:bg-brand-soft hover:text-text-primary'
    }`;

  return (
    <div className="overflow-hidden rounded-xl border border-border-soft bg-bg-card">
      {/* 工具列 */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border-soft bg-bg-surface px-3 py-2">
        {/* 復原 / 重做 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${btnClass()} disabled:opacity-40`}
          title="復原"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${btnClass()} disabled:opacity-40`}
          title="重做"
        >
          <Redo2 className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-border-soft" />

        {/* 標題與字級 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={btnClass(editor.isActive('heading', { level: 1 }))}
          title="大標題 H1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive('heading', { level: 2 }))}
          title="中標題 H2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass(editor.isActive('heading', { level: 3 }))}
          title="小標題 H3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <select
          aria-label="字體大小"
          value={(editor.getAttributes('textStyle').fontSize as string) || ''}
          onChange={(e) => {
            const size = e.target.value;
            if (!size) {
              editor.chain().focus().unsetFontSize().run();
            } else {
              editor.chain().focus().setFontSize(size).run();
            }
          }}
          className="input-warm py-1 text-xs"
        >
          {FONT_SIZE_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="mx-1 h-5 w-px bg-border-soft" />

        {/* 文字樣式 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
          title="粗體"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
          title="斜體"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnClass(editor.isActive('underline'))}
          title="底線"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btnClass(editor.isActive('strike'))}
          title="刪除線"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        {/* 文字顏色 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowColorMenu((v) => !v);
              setShowHighlightMenu(false);
            }}
            className={btnClass()}
            title="文字顏色"
          >
            <Palette className="h-4 w-4" />
          </button>
          {showColorMenu && (
            <div className="card-warm absolute right-0 top-9 z-20 w-44 p-2 sm:left-0 sm:right-auto">
              <p className="mb-1.5 text-xs font-semibold text-text-muted">文字顏色</p>
              <div className="flex flex-wrap gap-1.5">
                {EDITOR_TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => {
                      editor.chain().focus().setColor(c.value).run();
                      setShowColorMenu(false);
                    }}
                    className="h-6 w-6 rounded-full border border-border-soft"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorMenu(false);
                }}
                className="mt-2 w-full rounded-md bg-bg-surface py-1 text-xs text-text-secondary hover:bg-brand-soft"
              >
                恢復預設文字色
              </button>
            </div>
          )}
        </div>

        {/* 重點高亮底色 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowHighlightMenu((v) => !v);
              setShowColorMenu(false);
            }}
            className={btnClass(editor.isActive('highlight'))}
            title="文字高亮底色"
          >
            <Highlighter className="h-4 w-4" />
          </button>
          {showHighlightMenu && (
            <div className="card-warm absolute right-0 top-9 z-20 w-44 p-2 sm:left-0 sm:right-auto">
              <p className="mb-1.5 text-xs font-semibold text-text-muted">螢光標記底色</p>
              <div className="flex flex-wrap gap-1.5">
                {EDITOR_HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color: c.value }).run();
                      setShowHighlightMenu(false);
                    }}
                    className="h-6 w-6 rounded-full border border-border-soft"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setShowHighlightMenu(false);
                }}
                className="mt-2 w-full rounded-md bg-bg-surface py-1 text-xs text-text-secondary hover:bg-brand-soft"
              >
                清除高亮
              </button>
            </div>
          )}
        </div>

        <span className="mx-1 h-5 w-px bg-border-soft" />

        {/* 對齊 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={btnClass(editor.isActive({ textAlign: 'left' }))}
          title="靠左對齊"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={btnClass(editor.isActive({ textAlign: 'center' }))}
          title="置中對齊"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={btnClass(editor.isActive({ textAlign: 'right' }))}
          title="靠右對齊"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-border-soft" />

        {/* 清單與引用 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
          title="項目清單"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
          title="編號清單"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive('blockquote'))}
          title="引用提示框"
        >
          <Quote className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-border-soft" />

        {/* 超連結與文內圖片 */}
        <button
          type="button"
          onClick={handleAddLink}
          className={btnClass(editor.isActive('link'))}
          title="插入超連結"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleAddImageUrl}
          className={btnClass()}
          title="貼上圖片網址"
        >
          <ImagePlus className="h-4 w-4" />
        </button>
        <label
          className={`${btnClass()} cursor-pointer`}
          title="從電腦選擇圖片插入文章"
        >
          <span className="px-1 text-xs">上傳插圖</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadInlineImage}
            className="hidden"
          />
        </label>

        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className={btnClass()}
          title="清除文字樣式"
        >
          <RemoveFormatting className="h-4 w-4" />
        </button>
      </div>

      {/* 編輯區域 */}
      <EditorContent editor={editor} />
    </div>
  );
};

