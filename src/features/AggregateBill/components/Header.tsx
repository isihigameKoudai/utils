import { Link } from '@tanstack/react-router';

import { styled } from '@/utils/ui/styled';

const HeaderContainer = styled('header')({
  backgroundColor: '#4a90e2',
  padding: '1rem 2rem',
  color: 'white',
});

const Nav = styled('nav')({
  display: 'flex',
  gap: '2rem',
});

const StyledLink = styled(Link)({
  color: 'white',
  textDecoration: 'none',
  fontSize: '1.1rem',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  transition: 'background-color 0.2s',
  $nest: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
});

export const Header = () => {
  return (
    <HeaderContainer>
      <Nav>
        <StyledLink to="/aggregate-bill">請求一覧</StyledLink>
        <StyledLink to="/aggregate-bill/summary">集計結果</StyledLink>
      </Nav>
    </HeaderContainer>
  );
};
