import React, { useEffect, useRef } from 'react';
import WebGL from './modules/WebGL';

const StableFluids: React.FC = () => {
  const $ref = useRef<HTMLDivElement>(null!);
  let isInit = true;

  useEffect(() => {
    if (isInit) {
      new WebGL({
        $wrapper: $ref.current,
      });
      isInit = false;
    }
  }, []);

  return <div id="fluids" ref={$ref}></div>;
};

export default StableFluids;
