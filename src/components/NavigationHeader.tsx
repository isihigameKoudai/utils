import type React from 'react';
import { useState } from 'react';

import Box from '@/utils/ui/Box';

import Menu from './Menu';

export const NavigationHeader: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box as="header" zIndex={10} position="relative">
			<button
				type="button"
				style={{
					position: 'fixed',
					top: 10,
					right: 10,
				}}
				onClick={() => setIsOpen(true)}
			>
				Menu
			</button>
			{isOpen && <Menu onClose={() => setIsOpen(false)} />}
		</Box>
	);
};
