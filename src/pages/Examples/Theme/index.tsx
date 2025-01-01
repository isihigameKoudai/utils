import React from 'react';
import { styled } from '../../../../packages/ui/styled';
import { ThemeContainer } from './defaultTheme';
// スタイル付きコンポーネントの作成
const Container = styled('div')((theme) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: `${theme.shape.borderRadius}px`,
  boxShadow: theme.shadows[0],
}));

const Title = styled('h1')((theme) => ({
  ...theme.typography.h1,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const Button = styled('button')((theme) => ({
  padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  border: 'none',
  borderRadius: `${theme.shape.borderRadius}px`,
  cursor: 'pointer',
  ...theme.typography.button,
  transition: `background-color ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Text = styled('p')((theme) => ({
  ...theme.typography.body1,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

// テモページコンポーネント
const ThemeDemo = () => {
  
  return (
    <Container>
      <Title>Theme Demo</Title>
      <Text>
        This is a demonstration of our custom theming system using vanilla-extract and unstated-next.
        The components on this page are styled using our custom styled function.
      </Text>
      <Button type="submit">submit</Button>
    </Container>
  );
};

export default () => (
  <ThemeContainer.Provider>
    <ThemeDemo />
  </ThemeContainer.Provider>
);
