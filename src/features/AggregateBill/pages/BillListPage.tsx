import { BillStore } from '../stores/billStore';
import { styled } from '@/utils/ui/styled';

const Container = styled('div')({
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto'
});

export const BillListPage = () => {
  const { queries, actions, state } = BillStore.useStore();
  console.log(queries.rakutenRecords, state.rakuten);
  return (
    <Container>
      <button type="button" onClick={() => actions.fetchCSVRecords({ brand: 'rakuten' })}>
        click
      </button>
    </Container>
  );
}; 
