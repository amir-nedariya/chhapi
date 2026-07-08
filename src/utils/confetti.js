/**
 * Zero-dependency helper to fire a premium confetti cannon effect
 * launching from the bottom center of the screen upwards.
 */
export const fireConfetti = () => {
  const duration = 1500;
  const animationEnd = Date.now() + duration;
  const colors = ["#22c55e", "#0ea5e9", "#eab308", "#ec4899", "#a855f7", "#f97316", "#14b8a6"];

  const interval = setInterval(() => {
    if (Date.now() > animationEnd) {
      return clearInterval(interval);
    }

    // Launch 4 particles per tick from the bottom center (making it subtle)
    for (let i = 0; i < 4; i++) {
      const p = document.createElement("div");
      p.style.position = "fixed";
      p.style.zIndex = "9999";
      p.style.pointerEvents = "none";
      p.style.width = `${Math.random() * 8 + 4}px`;
      p.style.height = `${Math.random() * 6 + 4}px`;
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      // Bottom center launch point
      p.style.left = "50vw";
      p.style.top = "100vh";
      p.style.borderRadius = Math.random() > 0.4 ? "50%" : "2px";

      let rotation = Math.random() * 360;
      p.style.transform = `rotate(${rotation}deg)`;

      document.body.appendChild(p);

      let x = window.innerWidth / 2;
      let y = window.innerHeight;

      // Negative velocity to shoot UP
      let vy = -(Math.random() * 12 + 10); // Shoots up gently
      let vx = (Math.random() * 12 - 6);   // Spread left/right
      const gravity = 0.45;                // Pull down
      const rotationSpeed = Math.random() * 8 - 4;

      const run = () => {
        if (!p.parentNode) return;

        vy += gravity; // Pulls down
        x += vx;
        y += vy;
        rotation += rotationSpeed;

        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.transform = `rotate(${rotation}deg)`;

        // Remove if it falls below the viewport or goes too far out horizontally
        if (y < window.innerHeight + 50 && x > -50 && x < window.innerWidth + 50) {
          requestAnimationFrame(run);
        } else {
          p.remove();
        }
      };

      requestAnimationFrame(run);
    }
  }, 100);
};
