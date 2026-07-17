import type React from 'react';
import { useRef, useState } from 'react';

import { FaceDetection } from '../../utils/tensorflow';

interface FaceDetectionViewProps {
	width?: number;
	height?: number;
}

const FaceDetectionView: React.FC<FaceDetectionViewProps> = ({
	width = 640,
	height = 480,
}) => {
	const detector = new FaceDetection({
		navigator: window.navigator,
		document,
		window,
	});
	const $video = useRef<HTMLVideoElement>(null);
	const $face = useRef<HTMLDivElement>(null);
	const [points, setPoints] = useState<
		{ x: number; y: number; name: string }[]
	>([]);

	const setFace = (face: FaceDetection['detectedFaces'][number]) => {
		if (!$face.current) return;

		const { yMin, xMin, width, height } = face.box;
		const faceElement = $face.current;
		faceElement.style.top = `${yMin}px`;
		faceElement.style.left = `${xMin}px`;
		faceElement.style.width = `${width}px`;
		faceElement.style.height = `${height}px`;

		const { keypoints } = face;
		setPoints(
			keypoints.map((point) => ({
				x: point.x,
				y: point.y,
				name: point.name || '',
			})),
		);
	};

	const handleLoad = async () => {
		if (!$video.current) return;

		await detector.load({
			$video: $video.current,
			width,
			height,
		});
	};

	const handleStart = () => {
		detector.start((faces) => {
			if (faces.length > 0) {
				setFace(faces[0]);
			}
		});
	};

	const handleStop = () => {
		detector.stop();
	};

	return (
		<div>
			<button type="button" onClick={handleLoad}>
				Load
			</button>
			<button type="button" onClick={handleStart}>
				Start
			</button>
			<button type="button" onClick={handleStop}>
				Stop
			</button>
			<div
				style={{
					width: `${width}px`,
					height: `${height}px`,
					position: 'relative',
				}}
			>
				<video
					ref={$video}
					width={width}
					height={height}
					muted
					autoPlay
					playsInline
				/>
				<div
					ref={$face}
					style={{
						position: 'absolute',
						background: 'transparent',
						border: 'solid 2px #ff2b2b',
						pointerEvents: 'none',
					}}
				/>
				{points.map((point, index) => {
					// eslint-disable-next-line react/no-array-index-key
					return (
						<div
							key={point.name || `keypoint-${index}`}
							className={point.name}
							style={{
								position: 'absolute',
								width: 4,
								height: 4,
								top: point.y - 2,
								left: point.x - 2,
								background: '#ccc',
								borderRadius: '50%',
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};
export default FaceDetectionView;
