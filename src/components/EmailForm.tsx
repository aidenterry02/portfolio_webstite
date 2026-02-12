import { FC, useState } from "react";

interface EmailFormProps {
  onSubmit?: () => void;
}

const EmailForm: FC<EmailFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link with pre-filled content
    const subject = `Message from ${name}`;
    const body = `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:aiden.t.terry@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
    
    setStatus("success");
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setStatus("idle");
      onSubmit?.();
    }, 2000);
  };

  if (status === "success") {
    return (
      <div className="border border-terminal-green/40 p-3 sm:p-4 my-2 bg-terminal-green/5">
        <div className="text-terminal-green text-xs sm:text-sm">
          ✓ OPENING EMAIL CLIENT...
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="border border-terminal-green/40 p-3 sm:p-4 my-2 space-y-3 bg-terminal-green/5"
    >
      <div className="space-y-2">
        <label className="block text-xs sm:text-sm">
          <span className="text-terminal-green">NAME:</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full mt-1 bg-background border border-terminal-green/40 px-2 py-1 text-foreground font-mono text-xs sm:text-sm focus:outline-none focus:border-terminal-green"
            placeholder="Enter your name"
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-xs sm:text-sm">
          <span className="text-terminal-green">EMAIL:</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 bg-background border border-terminal-green/40 px-2 py-1 text-foreground font-mono text-xs sm:text-sm focus:outline-none focus:border-terminal-green"
            placeholder="your@email.com"
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-xs sm:text-sm">
          <span className="text-terminal-green">MESSAGE:</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full mt-1 bg-background border border-terminal-green/40 px-2 py-1 text-foreground font-mono text-xs sm:text-sm focus:outline-none focus:border-terminal-green resize-none"
            placeholder="Enter your message..."
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 border border-terminal-green bg-terminal-green/10 hover:bg-terminal-green/30 transition-colors text-terminal-green font-mono text-xs sm:text-sm"
        >
          [SEND TRANSMISSION]
        </button>
      </div>
    </form>
  );
};

export default EmailForm;
