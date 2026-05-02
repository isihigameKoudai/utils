import React from 'react';

import { ALL_SUPPORTED_TYPES } from '../../constants';
import { useEmbeddingFeature } from '../../hooks';

import {
  Button,
  Container,
  ErrorBox,
  InfoBox,
  Input,
  Label,
  MetadataGrid,
  MetadataItem,
  MetadataLabel,
  MetadataValue,
  ResultBox,
  ResultTitle,
  Section,
  Subtitle,
  TextArea,
  Title,
  VectorPreview,
} from './style';

export const GeminiEmbeddingPage: React.FC = () => {
  const {
    inputMode,
    setInputMode,
    inputText,
    setInputText,
    selectedFile,
    setSelectedFile,
    filePreviewUrl,
    embeddingResult,
    generationResult,
    databaseItems,
    searchResults,
    searchOrder,
    isLoading,
    error,
    handleEmbed,
    handleAddToDatabase,
    handleSearchDatabase,
    handleGenerateText,
    handleReset,
    setSearchOrder,
  } = useEmbeddingFeature();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file ?? null);
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
                onChange={() => setInputMode('text')}
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
                onChange={() => setInputMode('file')}
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
          <Button type="button" onClick={handleEmbed} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Generate Embedding'}
          </Button>

          <Button
            type="button"
            onClick={handleAddToDatabase}
            disabled={
              isLoading ||
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
              isLoading ||
              databaseItems.length === 0 ||
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
              disabled={isLoading || !selectedFile || !inputText.trim()}
              style={{ backgroundColor: '#10b981' }}
            >
              Ask Question (Generate Text)
            </Button>
          )}

          {(embeddingResult !== null ||
            generationResult !== null ||
            searchResults !== null) && (
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

      {embeddingResult !== null && (
        <ResultBox>
          <ResultTitle>Embedding Result</ResultTitle>

          <MetadataGrid>
            <MetadataItem>
              <MetadataLabel>Model</MetadataLabel>
              <MetadataValue>{embeddingResult.model}</MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Dimensions</MetadataLabel>
              <MetadataValue>{embeddingResult.dimensionsLabel}</MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Execution Time</MetadataLabel>
              <MetadataValue>
                {embeddingResult.executionTimeLabel}
              </MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Vector Norm (L2)</MetadataLabel>
              <MetadataValue>
                {embeddingResult.vectorNorm.toFixed(4)}
              </MetadataValue>
            </MetadataItem>
          </MetadataGrid>

          <Label>Vector Preview (first 100 values)</Label>
          <VectorPreview>{embeddingResult.previewString}</VectorPreview>
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
                {generationResult.executionTimeLabel}
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

      {databaseItems.length > 0 && (
        <Section style={{ marginTop: '2rem' }}>
          <Title style={{ fontSize: '1.5rem' }}>
            Local Vector Database ({databaseItems.length} items)
          </Title>
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            }}
          >
            {databaseItems.map((item) => (
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
                {item.hasPreview && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={item.previewUrl!}
                      alt=""
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100px',
                        objectFit: 'cover',
                      }}
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Vector dimensions: {item.dimensions}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {searchResults !== null && (
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
            {searchResults.map((item, index) => (
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
                {item.hasPreview && (
                  <img
                    src={item.previewUrl!}
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
