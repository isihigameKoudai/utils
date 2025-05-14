import { BillTable } from '../components/BillTable';
import { BillUploader } from '../components/BillUploader';
import { BillStore } from '../stores/billStore';
import { styled } from '@/utils/ui/styled';

const Container = styled('div')({
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto'
});

const Title = styled('h1')({
  fontSize: '2rem',
  marginBottom: '2rem'
});

const ErrorMessage = styled('div')({
  color: '#ff4444',
  marginBottom: '1rem',
  padding: '0.5rem',
  backgroundColor: '#ffeeee',
  borderRadius: '4px'
});

export const BillListPage = () => {
  const { state } = BillStore.useStore();

  return (
    <Container>
      <Title>クレジットカード明細一覧</Title>
      {state.error && <ErrorMessage>{state.error}</ErrorMessage>}
      <BillUploader />
      <BillTable />
    </Container>
  );
}; 
