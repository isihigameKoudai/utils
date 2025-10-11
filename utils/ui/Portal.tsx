import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactNode;
  id: string;
}

const Portal: React.FC<Props> = ({ children, id }) => {
  const targetEl = document.getElementById(id);

  if (!targetEl) {
    return null;
  }

  return createPortal(children, targetEl);
};

export default Portal;
