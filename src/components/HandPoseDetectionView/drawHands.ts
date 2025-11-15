import type { Hand } from '@tensorflow-models/hand-pose-detection';

const fingerLookupIndices = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

const HAND_COLORS = {
  Left: {
    keypoint: '#00ff00', // 緑
    connection: '#00cc00',
  },
  Right: {
    keypoint: '#ff0000', // 赤
    connection: '#cc0000',
  },
};

export const drawHands = (canvas: HTMLCanvasElement, hands: Hand[]) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // キャンバスをクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hands.forEach((hand) => {
    const keypoints = hand.keypoints;
    const handedness = hand.handedness; // 'Left' or 'Right'
    const colors = HAND_COLORS[handedness];

    // 手のキーポイントを描画
    keypoints.forEach((keypoint) => {
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = colors.keypoint;
      ctx.fill();
    });

    // 指の線を描画
    Object.values(fingerLookupIndices).forEach((fingerIndices) => {
      const points = fingerIndices.map((idx) => keypoints[idx]);

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      points.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });

      ctx.strokeStyle = colors.connection;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  });
};
