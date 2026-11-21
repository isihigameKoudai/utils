import { WebGL as BaseWebGL } from '@/shared/modules/fluids';
import { VisualDetection } from '@utils/modules/tensorflow';

type Props = {
	$wrapper: HTMLElement;
};

export default class WebGL extends BaseWebGL {
	$video: HTMLVideoElement | null;

	constructor({ $wrapper }: Props) {
		super({ $wrapper });
		this.$video = null;
	}

	async initDetector({
		width = window.innerWidth,
		height = window.innerHeight,
	}: {
		width?: number;
		height?: number;
	}) {
		const detector = new VisualDetection({
			navigator: window.navigator,
			document,
			window,
		});
		await detector.load({ width, height });
		return detector;
	}
}
