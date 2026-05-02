import React, { useState } from 'react';

import { cosineSimilarity } from '@/utils/math';
import { styled } from '@/utils/ui/styled';

import { useGeminiEmbedding } from '../hooks/useGeminiEmbedding';

const Container = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

const Title = styled('h1')({
  fontSize: '2rem',
  fontWeight: '700',
  marginBottom: '0.5rem',
  color: '#1a1a1a',
});

const Subtitle = styled('p')({
  fontSize: '1rem',
  color: '#666',
  marginBottom: '2rem',
});

const Section = styled('div')({
  marginBottom: '2rem',
});

const Label = styled('label')({
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '600',
  marginBottom: '0.5rem',
  color: '#374151',
});

const Input = styled('input')({
  width: '100%',
  padding: '0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
  $nest: {
    '&:focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  },
});

const TextArea = styled('textarea')({
  width: '100%',
  padding: '0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  outline: 'none',
  resize: 'vertical',
  minHeight: '120px',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  $nest: {
    '&:focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  },
});

const Button = styled('button')({
  padding: '0.75rem 1.5rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: 'white',
  backgroundColor: '#3b82f6',
  border: 'none',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'background-color 0.15s',
  $nest: {
    '&:hover': {
      backgroundColor: '#2563eb',
    },
    '&:disabled': {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
    },
  },
});

const ResultBox = styled('div')({
  padding: '1.5rem',
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '0.5rem',
  marginTop: '1rem',
});

const ResultTitle = styled('h3')({
  fontSize: '1.125rem',
  fontWeight: '600',
  marginBottom: '1rem',
  color: '#1a1a1a',
});

const MetadataGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
  marginBottom: '1.5rem',
});

const MetadataItem = styled('div')({
  padding: '0.75rem',
  backgroundColor: 'white',
  borderRadius: '0.375rem',
  border: '1px solid #e5e7eb',
});

const MetadataLabel = styled('div')({
  fontSize: '0.75rem',
  color: '#6b7280',
  marginBottom: '0.25rem',
});

const MetadataValue = styled('div')({
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1a1a1a',
});

const VectorPreview = styled('div')({
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  color: '#4b5563',
  padding: '1rem',
  backgroundColor: 'white',
  borderRadius: '0.375rem',
  border: '1px solid #e5e7eb',
  overflowX: 'auto',
  maxHeight: '200px',
  overflowY: 'auto',
});

const ErrorBox = styled('div')({
  padding: '1rem',
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '0.375rem',
  color: '#991b1b',
  fontSize: '0.875rem',
  marginTop: '1rem',
});

const InfoBox = styled('div')({
  padding: '1rem',
  backgroundColor: '#eff6ff',
  border: '1px solid #bfdbfe',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  color: '#1e40af',
  marginBottom: '2rem',
});

type InputMode = 'text' | 'file';

type DatabaseItem = {
  id: string;
  label: string;
  previewUrl: string | null;
  values: number[];
  type: InputMode;
};

const SUPPORTED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  video: ['video/mp4', 'video/mov', 'video/mpeg', 'video/avi', 'video/webm'],
  audio: ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/mpeg'],
  pdf: ['application/pdf'],
};

const ALL_SUPPORTED_TYPES = [
  ...SUPPORTED_MIME_TYPES.image,
  ...SUPPORTED_MIME_TYPES.video,
  ...SUPPORTED_MIME_TYPES.audio,
  ...SUPPORTED_MIME_TYPES.pdf,
].join(',');

const GeminiEmbeddingPage: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [database, setDatabase] = useState<DatabaseItem[]>([]);
  const [searchOrder, setSearchOrder] = useState<'closest' | 'furthest'>(
    'closest',
  );
  const [searchResult, setSearchResult] = useState<Array<
    DatabaseItem & { similarity: number }
  > | null>(null);

  const {
    embed,
    embedFile,
    generateFileContent,
    result,
    generationResult,
    loading,
    error,
    reset,
  } = useGeminiEmbedding();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else if (
      file.type.startsWith('video/') ||
      file.type.startsWith('audio/')
    ) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleEmbed = () => {
    if (inputMode === 'text') {
      embed(inputText);
    } else if (selectedFile) {
      embedFile(selectedFile, inputText);
    }
  };

  const handleAddToDatabase = async () => {
    const res =
      inputMode === 'text'
        ? await embed(inputText)
        : await embedFile(selectedFile!);

    if (res) {
      const newItem: DatabaseItem = {
        id: crypto.randomUUID(),
        label: inputMode === 'text' ? inputText : selectedFile!.name,
        previewUrl: filePreviewUrl,
        values: res.values,
        type: inputMode,
      };
      setDatabase((prev) => [...prev, newItem]);
    }
  };

  const handleSearchDatabase = async () => {
    const res =
      inputMode === 'text'
        ? await embed(inputText)
        : await embedFile(selectedFile!);

    if (res) {
      const results = database.map((item) => ({
        ...item,
        similarity: cosineSimilarity(res!.values, item.values),
      }));
      setSearchResult(results);
    }
  };

  const sortedSearchResults = React.useMemo(() => {
    if (!searchResult) return null;
    return [...searchResult].sort((a, b) => {
      if (searchOrder === 'closest') {
        return b.similarity - a.similarity;
      } else {
        return a.similarity - b.similarity;
      }
    });
  }, [searchResult, searchOrder]);

  const handleGenerateText = () => {
    if (selectedFile && inputText.trim()) {
      generateFileContent(selectedFile, inputText);
    }
  };

  const handleReset = () => {
    reset();
    setInputText('');
    setSelectedFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  };

  return (
    <Container>
      <Title>Gemini Embedding 2 Playground</Title>
      <Subtitle>
        Generate multimodal embeddings using Google&apos;s latest embedding
        model (text, image, video, audio, PDF)
      </Subtitle>

      <InfoBox>
        <strong>Note:</strong> Get your API key from{' '}
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#2563eb', textDecoration: 'underline' }}
        >
          Google AI Studio
        </a>
        . Your key is stored locally and never sent to our servers.
      </InfoBox>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Section>
          <Label>Input Mode</Label>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="inputMode"
                value="text"
                checked={inputMode === 'text'}
                onChange={(e) => setInputMode(e.target.value as InputMode)}
              />
              Text
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="inputMode"
                value="file"
                checked={inputMode === 'file'}
                onChange={(e) => setInputMode(e.target.value as InputMode)}
              />
              File (Image / Video / Audio / PDF)
            </label>
          </div>
        </Section>

        {inputMode === 'text' ? (
          <Section>
            <Label htmlFor="inputText">Input Text</Label>
            <TextArea
              id="inputText"
              placeholder="Enter text to embed... (e.g., 'What is the meaning of life?')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required
            />
          </Section>
        ) : (
          <>
            <Section>
              <Label htmlFor="fileInput">Upload File</Label>
              <Input
                id="fileInput"
                type="file"
                accept={ALL_SUPPORTED_TYPES}
                onChange={handleFileChange}
                required
              />
              {selectedFile && (
                <div
                  style={{
                    marginTop: '1rem',
                    fontSize: '0.875rem',
                    color: '#6b7280',
                  }}
                >
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              {filePreviewUrl && selectedFile && (
                <div style={{ marginTop: '1rem' }}>
                  {selectedFile.type.startsWith('image/') && (
                    <img
                      src={filePreviewUrl}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '0.375rem',
                      }}
                    />
                  )}
                  {selectedFile.type.startsWith('video/') && (
                    <video
                      src={filePreviewUrl}
                      controls
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '0.375rem',
                      }}
                    />
                  )}
                  {selectedFile.type.startsWith('audio/') && (
                    <audio
                      src={filePreviewUrl}
                      controls
                      style={{ width: '100%' }}
                    />
                  )}
                </div>
              )}
            </Section>
            <Section>
              <Label htmlFor="filePromptText">
                Text Prompt (Optional for Embedding, Required for Text
                Generation)
              </Label>
              <TextArea
                id="filePromptText"
                placeholder="Ask a question about the file... (e.g., 'What is in this image?')"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </Section>
          </>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button type="button" onClick={handleEmbed} disabled={loading}>
            {loading ? 'Processing...' : 'Generate Embedding'}
          </Button>

          <Button
            type="button"
            onClick={handleAddToDatabase}
            disabled={
              loading ||
              (inputMode === 'text' ? !inputText.trim() : !selectedFile)
            }
            style={{ backgroundColor: '#8b5cf6' }}
          >
            Add to Database
          </Button>

          <Button
            type="button"
            onClick={handleSearchDatabase}
            disabled={
              loading ||
              database.length === 0 ||
              (inputMode === 'text' ? !inputText.trim() : !selectedFile)
            }
            style={{ backgroundColor: '#f59e0b' }}
          >
            Search Database
          </Button>

          {inputMode === 'file' && (
            <Button
              type="button"
              onClick={handleGenerateText}
              disabled={loading || !selectedFile || !inputText.trim()}
              style={{ backgroundColor: '#10b981' }}
            >
              Ask Question (Generate Text)
            </Button>
          )}

          {(result !== null ||
            generationResult !== null ||
            searchResult !== null) && (
            <Button
              type="button"
              onClick={() => {
                handleReset();
                setSearchResult(null);
              }}
              style={{ backgroundColor: '#6b7280' }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {error !== null && <ErrorBox>Error: {error}</ErrorBox>}

      {result !== null && (
        <ResultBox>
          <ResultTitle>Embedding Result</ResultTitle>

          <MetadataGrid>
            <MetadataItem>
              <MetadataLabel>Model</MetadataLabel>
              <MetadataValue>{result.model}</MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Dimensions</MetadataLabel>
              <MetadataValue>{result.dimensions}</MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Execution Time</MetadataLabel>
              <MetadataValue>
                {result.executionTimeMs.toFixed(2)}ms
              </MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Vector Norm (L2)</MetadataLabel>
              <MetadataValue>
                {Math.sqrt(
                  result.values.reduce((sum, val) => sum + val * val, 0),
                ).toFixed(4)}
              </MetadataValue>
            </MetadataItem>
          </MetadataGrid>

          <Label>Vector Preview (first 100 values)</Label>
          <VectorPreview>
            [{result.values.slice(0, 100).join(', ')}
            {result.values.length > 100 && ', ...'}]
          </VectorPreview>
        </ResultBox>
      )}

      {generationResult !== null && (
        <ResultBox>
          <ResultTitle>Generated Text (Ask Question)</ResultTitle>

          <MetadataGrid>
            <MetadataItem>
              <MetadataLabel>Model</MetadataLabel>
              <MetadataValue>{generationResult.model}</MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Execution Time</MetadataLabel>
              <MetadataValue>
                {generationResult.executionTimeMs.toFixed(2)}ms
              </MetadataValue>
            </MetadataItem>
          </MetadataGrid>

          <Label>Response</Label>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              whiteSpace: 'pre-wrap',
              color: '#1a1a1a',
              lineHeight: '1.6',
            }}
          >
            {generationResult.text}
          </div>
        </ResultBox>
      )}

      {database.length > 0 && (
        <Section style={{ marginTop: '2rem' }}>
          <Title style={{ fontSize: '1.5rem' }}>
            Local Vector Database ({database.length} items)
          </Title>
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            }}
          >
            {database.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                }}
              >
                <div
                  style={{
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    wordBreak: 'break-all',
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem',
                  }}
                >
                  Type: {item.type}
                </div>
                {item.previewUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {item.type === 'file' && (
                      <img
                        src={item.previewUrl}
                        alt=""
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100px',
                          objectFit: 'cover',
                        }}
                        onError={(e) =>
                          (e.currentTarget.style.display = 'none')
                        }
                      />
                    )}
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Vector dimensions: {item.values.length}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {sortedSearchResults !== null && (
        <Section
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#fef3c7',
            borderRadius: '0.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <Title style={{ fontSize: '1.5rem', margin: 0 }}>
              Search Results (Cosine Similarity)
            </Title>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Label style={{ margin: 0 }}>Sort Order:</Label>
              <select
                value={searchOrder}
                onChange={(e) =>
                  setSearchOrder(e.target.value as 'closest' | 'furthest')
                }
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #d1d5db',
                }}
              >
                <option value="closest">Closest (Most similar)</option>
                <option value="furthest">Furthest (Least similar)</option>
              </select>
            </div>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {sortedSearchResults.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#d97706',
                    minWidth: '3rem',
                  }}
                >
                  #{index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                    Similarity Score:{' '}
                    <strong
                      style={{
                        color:
                          searchOrder === 'closest' && index === 0
                            ? '#10b981'
                            : '#1f2937',
                      }}
                    >
                      {item.similarity.toFixed(4)}
                    </strong>
                  </div>
                </div>
                {item.previewUrl && (
                  <img
                    src={item.previewUrl}
                    alt=""
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '0.25rem',
                    }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </Container>
  );
};

export default GeminiEmbeddingPage;
