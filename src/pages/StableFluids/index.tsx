import React, { useEffect, useRef } from 'react';
import { WebGL } from '@/src/shared/modules/fluids';

const StableFluids: React.FC = () => {
  const $ref = useRef<HTMLDivElement>(null!);
  const isInitRef = useRef(true);

  useEffect(() => {
    if (isInitRef.current) {
      new WebGL({
        $wrapper: $ref.current,
      });
      isInitRef.current = false;
    }
  }, []);

  return <div id="fluids" ref={$ref}></div>;
};

export default StableFluids;
