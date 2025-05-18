import { BRAND } from '../constants/brand';
import { BillStore } from '../stores/billStore';
import { styled } from '@/utils/ui/styled';

const Container = styled('div')({
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto'
});

const BrandFileOpener = styled('div')({
  display: 'flex',
});

export const BillListPage = () => {
  const { queries, actions, state } = BillStore.useStore();
  console.log(queries.rakutenRecords, state.rakuten);
  return (
    <Container>
      {
        Object.values(BRAND).map(brand => (
          <BrandFileOpener key={brand.value}>
            <button type="button" onClick={() => actions.fetchCSVRecords({ brand: brand.value })}>
              {brand.label}CSV取り込み
            </button>
          </BrandFileOpener>
        ))
      }
    </Container>
  );
}; 
