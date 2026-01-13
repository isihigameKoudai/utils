import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactNode;
  id: string;
}

// eslint-disable-next-line react/prop-types
const Portal: React.FC<Props> = ({ children, id }) => {
  const targetEl = document.getElementById(id);

  if (!targetEl) {
    return null;
  }

  return createPortal(children, targetEl);
};

Portal.displayName = 'Portal';

export default Portal;
