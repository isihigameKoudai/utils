import type { ReactComponentImplementation } from '@a2ui/react/v0_9';
import { A2uiSurface } from '@a2ui/react/v0_9';
import type { A2uiMessage, SurfaceModel } from '@a2ui/web_core/v0_9';
import { MessageProcessor } from '@a2ui/web_core/v0_9';
import { useEffect, useRef, useState } from 'react';

import { myCatalog } from '../../catalog';
import { MOCK_PHASES } from '../../constants/mockMessages';

import {
	Container,
	ControlBar,
	EmptyIcon,
	EmptyState,
	EmptyText,
	PhaseBadge,
	PhaseLog,
	PlayButton,
	phaseBadgeActiveStyle,
	phaseBadgeInactiveStyle,
	ResetButton,
	SurfaceWrapper,
	surfaceWrapperVars,
} from './style';

type PlayState = 'idle' | 'playing' | 'done';

export const GenerativeUIPage: React.FC = () => {
	const [surfaces, setSurfaces] = useState<
		SurfaceModel<ReactComponentImplementation>[]
	>([]);
	const [playState, setPlayState] = useState<PlayState>('idle');
	const [completedPhases, setCompletedPhases] = useState<Set<number>>(
		new Set(),
	);
	const processorRef =
		useRef<MessageProcessor<ReactComponentImplementation> | null>(null);
	const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

	const reset = () => {
		for (const t of timeoutsRef.current) clearTimeout(t);
		timeoutsRef.current = [];
		processorRef.current = null;
		setSurfaces([]);
		setPlayState('idle');
		setCompletedPhases(new Set());
	};
	const resetRef = useRef(reset);
	resetRef.current = reset;

	useEffect(() => () => resetRef.current(), []);

	const play = () => {
		reset();

		const processor = new MessageProcessor<ReactComponentImplementation>([
			myCatalog,
		]);
		processorRef.current = processor;

		const sub = processor.model.onSurfaceCreated.subscribe((surface) => {
			setSurfaces((prev) => [...prev, surface]);
		});

		setPlayState('playing');

		MOCK_PHASES.forEach((phase, index) => {
			const t = setTimeout(() => {
				processor.processMessages([phase.message] as unknown as A2uiMessage[]);
				setCompletedPhases((prev) => new Set([...prev, index]));
				if (index === MOCK_PHASES.length - 1) {
					setPlayState('done');
					sub.unsubscribe();
				}
			}, phase.delayMs);
			timeoutsRef.current.push(t);
		});
	};

	return (
		<Container>
			<ControlBar>
				<PlayButton onClick={play} disabled={playState === 'playing'}>
					{playState === 'idle'
						? '▶ Play'
						: playState === 'playing'
							? '⏳ Generating…'
							: '✓ Done'}
				</PlayButton>
				<ResetButton onClick={reset} disabled={playState === 'idle'}>
					↺ Reset
				</ResetButton>
				<PhaseLog>
					{MOCK_PHASES.map((phase, i) => (
						<PhaseBadge
							key={phase.label}
							style={
								completedPhases.has(i)
									? phaseBadgeActiveStyle
									: phaseBadgeInactiveStyle
							}
						>
							{phase.label}
						</PhaseBadge>
					))}
				</PhaseLog>
			</ControlBar>

			<SurfaceWrapper style={surfaceWrapperVars}>
				{surfaces.length === 0 ? (
					<EmptyState>
						<EmptyIcon>🤖</EmptyIcon>
						<EmptyText>
							Press Play to watch the agent build the dashboard
						</EmptyText>
					</EmptyState>
				) : (
					surfaces.map((surface) => (
						<A2uiSurface key={surface.id} surface={surface} />
					))
				)}
			</SurfaceWrapper>
		</Container>
	);
};
