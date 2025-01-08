import { Pose } from '../../../packages/tensorflow';

export const drawPose = ($canvas: HTMLCanvasElement, poses: Pose[]) => {
  const ctx = $canvas.getContext('2d');
  if (!ctx) return;

  // キャンバスをクリア
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);

  // 接続する骨格のペアを定義
  const connections = [
    // 上半身
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'],
    ['right_shoulder', 'right_elbow'],
    ['left_elbow', 'left_wrist'],
    ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'left_hip'],
    ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'],
    ['right_hip', 'right_knee'],
    ['left_knee', 'left_ankle'],
    ['right_knee', 'right_ankle'],
    // 顔
    ['right_eye', 'left_eye'],
    ['right_eye', 'right_ear'],
    ['left_eye', 'left_ear'],
    ['nose', 'left_eye'],
    ['nose', 'right_eye'],
    ['nose', 'left_ear'],
    ['nose', 'right_ear'],
  ];

  poses.forEach(pose => {
    // キーポイントを描画
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score && keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
    });

    // 骨格線を描画
    connections.forEach(([start, end]) => {
      const startPoint = pose.keypoints.find(kp => kp.name === start);
      const endPoint = pose.keypoints.find(kp => kp.name === end);

      if (startPoint && endPoint && 
          startPoint.score && endPoint.score && 
          startPoint.score > 0.3 && endPoint.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  });
};
