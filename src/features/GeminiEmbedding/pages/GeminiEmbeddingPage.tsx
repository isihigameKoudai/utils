import React, { useState } from 'react';

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

          {(result !== null || generationResult !== null) && (
            <Button
              type="button"
              onClick={handleReset}
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
    </Container>
  );
};

export default GeminiEmbeddingPage;
