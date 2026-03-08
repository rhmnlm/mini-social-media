import { memo, useState } from "react";

const EMOJI_CATEGORIES = [
  { label: "😀", emojis: ["😀","😂","🥰","😍","🤣","😊","😇","🙂","😉","😅","😆","🤩","🥳","😎","😴","🤗","🤔","😬","😤","😭","😱","🫡","😏","🥺","🤭"] },
  { label: "🌸", emojis: ["🌸","🌺","🌻","🌹","🌷","🍀","☘️","🌿","🌱","🌲","🌙","☀️","🌈","⭐","❄️","🔥","🌊","🌴","🦋","🐶","🐱","🐻","🦊","🐼","🐨"] },
  { label: "🍕", emojis: ["🍕","🍔","🍟","🌮","🍜","🍣","🎂","🍰","🧁","🍩","🍪","☕","🍵","🍷","🥤","🍎","🍓","🫐","🍉","🍇"] },
  { label: "⚽", emojis: ["⚽","🏀","🎮","🎵","🎨","📷","🏆","🎯","🏋️","🎭","🎬","🎸","🎤","✈️","🚀","🌍","🏖️","🏔️"] },
  { label: "❤️", emojis: ["❤️","💙","💚","💛","🧡","💜","🖤","🤍","💔","❣️","💕","💗","💓","💖","💘","💝","🩷","🩵","✨","🔥","💯","🙌","👏","🫶","💪"] },
];

function EmojiPickerPopover({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="emoji-popover">
      <div className="emoji-tabs">
        {EMOJI_CATEGORIES.map((cat, i) => (
          <button
            key={i}
            className={`emoji-tab${i === activeTab ? " active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="emoji-grid">
        {EMOJI_CATEGORIES[activeTab].emojis.map((emoji) => (
          <button key={emoji} className="emoji-item" onClick={() => onSelect(emoji)}>
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default memo(EmojiPickerPopover);
