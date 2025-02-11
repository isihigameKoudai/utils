import React, { useState } from 'react';

import { styled } from '@/packages/ui/styled';

const Button = styled('button')({
  padding: '10px 20px',
  borderRadius: '5px'
});

const PlaygroundPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  // const customItems = [...Array(100)].map((_, i) => ({
  //   id: i,
  //   name: `Item ${i}`,
  //   height: Math.floor(Math.random() * 100) + 100
  // }));

  return (
    <div>
      <Button type='button' onClick={() => setOpen(!open)}>Click me</Button>
    </div>
  );
};

export default PlaygroundPage;
