import { Face } from './type';

const MESH_CONFIG = {
  point: {
    color: '#FF0000',
    size: 1
  },
  line: {
    color: 'rgba(255, 255, 255, 0.5)',
    width: 1
  }
};

export const drawMesh = (ctx: CanvasRenderingContext2D, face: Face) => {
  const keypoints = face.keypoints;

  // ポイントの描画
  ctx.fillStyle = MESH_CONFIG.point.color;
  keypoints.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, MESH_CONFIG.point.size, 0, 3 * Math.PI);
    ctx.fill();
  });

  // 輪郭線の描画
  ctx.strokeStyle = MESH_CONFIG.line.color;
  ctx.lineWidth = MESH_CONFIG.line.width;

  // 目
  drawEyes(ctx, keypoints);
  // 眉毛
  drawEyebrows(ctx, keypoints);
  // 唇
  drawLips(ctx, keypoints);
  // 顔の輪郭
  drawFaceOutline(ctx, keypoints);
};

function drawEyes(ctx: CanvasRenderingContext2D, keypoints: Face['keypoints']) {
  const leftEyePoints = keypoints.filter(point => point.name?.includes('leftEye'));
  const rightEyePoints = keypoints.filter(point => point.name?.includes('rightEye'));

  drawConnectedPoints(ctx, leftEyePoints);
  drawConnectedPoints(ctx, rightEyePoints);
}

function drawEyebrows(ctx: CanvasRenderingContext2D, keypoints: Face['keypoints']) {
  const leftEyebrowPoints = keypoints.filter(point => point.name?.includes('leftEyebrow'));
  const rightEyebrowPoints = keypoints.filter(point => point.name?.includes('rightEyebrow'));

  drawConnectedPoints(ctx, leftEyebrowPoints);
  drawConnectedPoints(ctx, rightEyebrowPoints);
}

function drawLips(ctx: CanvasRenderingContext2D, keypoints: Face['keypoints']) {
  const lipPoints = keypoints.filter(point => point.name?.includes('lips'));
  drawConnectedPoints(ctx, lipPoints);
}

function drawFaceOutline(ctx: CanvasRenderingContext2D, keypoints: Face['keypoints']) {
  const facePoints = keypoints.filter(point => point.name?.includes('face'));
  drawConnectedPoints(ctx, facePoints);
}

function drawConnectedPoints(ctx: CanvasRenderingContext2D, points: Face['keypoints']) {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  points.forEach((point, i) => {
    if (i === 0) return;
    ctx.lineTo(point.x, point.y);
  });
  
  ctx.closePath();
  ctx.stroke();
} 