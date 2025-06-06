import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setPortalNode(document.getElementById('modal-root'));
    return () => setMounted(false);
  }, []);

  if (!mounted || !portalNode) {
    return null;
  }

  return createPortal(children, portalNode);
};

export default Portal; 
