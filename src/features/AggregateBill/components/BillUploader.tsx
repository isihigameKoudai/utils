import { BillStore } from '../stores/billStore';
import { styled } from '@/utils/ui/styled';
import { parseCSV } from '../utils/csvParser';
import { Bill } from '../types/bill';

const UploadContainer = styled('div')({
  padding: '1rem',
  border: '2px dashed #ccc',
  borderRadius: '8px',
  textAlign: 'center',
  margin: '1rem 0'
});

const FileInput = styled('input')({
  display: 'none'
});

const UploadButton = styled('button')({
  padding: '0.5rem 1rem',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  $nest: {
    '&:hover': {
      backgroundColor: '#45a049'
    }
  }
});

export const BillUploader = () => {
  const { state, actions } = BillStore.useStore();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    actions.setLoading(true);
    actions.setError(null);

    try {
      for (const file of Array.from(files)) {
        const content = await file.text();
        const brand = file.name.split('_')[0] as Bill['brand'];
        const bills = parseCSV(content, brand);
        actions.addBills(bills);
      }
    } catch (error) {
      actions.setError('ファイルの読み込みに失敗しました');
    } finally {
      actions.setLoading(false);
    }
  };

  return (
    <UploadContainer>
      <FileInput
        type="file"
        accept=".csv"
        multiple
        onChange={handleFileUpload}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <UploadButton>CSVファイルを選択</UploadButton>
      </label>
    </UploadContainer>
  );
}; 
