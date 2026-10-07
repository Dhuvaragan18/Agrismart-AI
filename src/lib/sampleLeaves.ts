// Generates high-contrast sample plant leaf data URIs using canvas for quick disease testing
export function generateSampleLeaf(type: "tomato" | "paddy" | "corn"): string {
  if (typeof document === "undefined") return "";

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Background
  ctx.fillStyle = "#E8ECE1";
  ctx.fillRect(0, 0, 600, 600);

  if (type === "tomato") {
    // Tomato Leaf with Early Blight (Alternaria Solani) concentric lesions
    ctx.save();
    ctx.translate(300, 300);

    // Stem
    ctx.strokeStyle = "#4A6B32";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(0, 260);
    ctx.quadraticCurveTo(-10, 50, 0, -220);
    ctx.stroke();

    // Leaf Blade
    ctx.fillStyle = "#5E8C31";
    ctx.beginPath();
    ctx.moveTo(0, -220);
    ctx.bezierCurveTo(-180, -100, -200, 120, 0, 220);
    ctx.bezierCurveTo(200, 120, 180, -100, 0, -220);
    ctx.fill();

    // Veins
    ctx.strokeStyle = "#4A6F25";
    ctx.lineWidth = 3;
    for (let y = -140; y < 160; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(80, y - 30);
      ctx.moveTo(0, y);
      ctx.lineTo(-80, y - 30);
      ctx.stroke();
    }

    // Diseased spots (Concentric target board pattern of Alternaria solani)
    const spots = [
      { x: -50, y: -60, r: 28 },
      { x: 45, y: 30, r: 35 },
      { x: -40, y: 90, r: 22 },
      { x: 50, y: -110, r: 20 },
      { x: 10, y: 140, r: 18 },
    ];

    spots.forEach((spot) => {
      // Yellow chlorotic halo
      ctx.fillStyle = "rgba(225, 205, 50, 0.75)";
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Brown necrosis
      ctx.fillStyle = "#5A3214";
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
      ctx.fill();

      // Concentric rings inside lesion
      ctx.strokeStyle = "#381E0B";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.restore();
  } else if (type === "paddy") {
    // Paddy / Rice leaf with Blast (Magnaporthe oryzae) spindle-shaped lesions
    ctx.save();
    ctx.translate(300, 300);

    // Long slender rice leaf
    ctx.fillStyle = "#6B9B37";
    ctx.beginPath();
    ctx.moveTo(0, -260);
    ctx.quadraticCurveTo(-70, 0, -35, 260);
    ctx.lineTo(35, 260);
    ctx.quadraticCurveTo(70, 0, 0, -260);
    ctx.fill();

    // Central vein
    ctx.strokeStyle = "#8CB852";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -260);
    ctx.lineTo(0, 260);
    ctx.stroke();

    // Spindle / diamond shaped blast lesions with gray centers and brown borders
    const lesions = [
      { x: -15, y: -100, w: 25, h: 65 },
      { x: 15, y: 20, w: 28, h: 75 },
      { x: -10, y: 130, w: 20, h: 50 },
    ];

    lesions.forEach((l) => {
      // Yellow border
      ctx.fillStyle = "#D6C438";
      ctx.beginPath();
      ctx.ellipse(l.x, l.y, l.w * 1.4, l.h * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();

      // Red-brown margin
      ctx.fillStyle = "#7D2815";
      ctx.beginPath();
      ctx.ellipse(l.x, l.y, l.w, l.h, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ash-gray necrotic center
      ctx.fillStyle = "#9C948B";
      ctx.beginPath();
      ctx.ellipse(l.x, l.y, l.w * 0.5, l.h * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  } else {
    // Corn / Maize Leaf Rust (Puccinia sorghi)
    ctx.save();
    ctx.translate(300, 300);

    // Wide wavy corn leaf
    ctx.fillStyle = "#5C8B29";
    ctx.beginPath();
    ctx.moveTo(0, -250);
    ctx.bezierCurveTo(-120, -100, -110, 100, -50, 260);
    ctx.lineTo(50, 260);
    ctx.bezierCurveTo(110, 100, 120, -100, 0, -250);
    ctx.fill();

    // Midrib
    ctx.strokeStyle = "#85B543";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, -250);
    ctx.lineTo(0, 260);
    ctx.stroke();

    // Orange-cinnamon powdery rust pustules scattered in clusters
    for (let i = 0; i < 45; i++) {
      const rx = (Math.random() - 0.5) * 140;
      const ry = (Math.random() - 0.5) * 360;
      ctx.fillStyle = "#B34A12";
      ctx.beginPath();
      ctx.ellipse(rx, ry, 6 + Math.random() * 6, 4 + Math.random() * 4, Math.random(), 0, Math.PI * 2);
      ctx.fill();

      // Yellowish edge
      ctx.strokeStyle = "#D99B26";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  return canvas.toDataURL("image/jpeg", 0.9);
}
