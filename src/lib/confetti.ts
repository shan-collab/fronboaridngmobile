export default function confetti() {
  const colors = ["#4A90D9", "#FFD700", "#FF4444", "#44FF44", "#FF44FF", "#44FFFF"];
  const count = 80;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      z-index: 9999;
      pointer-events: none;
      animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  if (!document.getElementById("confetti-style")) {
    const style = document.createElement("style");
    style.id = "confetti-style";
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}
