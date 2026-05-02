import { useCallback, useMemo, useState } from 'react';

import { geminiApi } from '../api';
import type { InputMode } from '../models/databaseItem';
import {
  createEmbeddingService,
  createGenerationService,
  createDatabaseService,
} from '../services';
import { DatabaseStore } from '../stores/database';
import { EmbeddingStore } from '../stores/embedding';
import { GenerationStore } from '../stores/generation';

export const useEmbeddingFeature = () => {
  const embeddingStore = EmbeddingStore.useStore();
  const generationStore = GenerationStore.useStore();
  const databaseStore = DatabaseStore.useStore();

  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const embeddingService = useMemo(
    () =>
      createEmbeddingService({
        api: geminiApi,
        actions: embeddingStore.actions,
      }),
    [embeddingStore.actions],
  );

  const generationService = useMemo(
    () =>
      createGenerationService({
        api: geminiApi,
        actions: generationStore.actions,
      }),
    [generationStore.actions],
  );

  const databaseService = useMemo(
    () => createDatabaseService({ actions: databaseStore.actions }),
    [databaseStore.actions],
  );

  const handleFileChange = useCallback(
    (file: File | null) => {
      setSelectedFile(file);

      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
        setFilePreviewUrl(null);
      }

      if (!file) return;

      if (
        file.type.startsWith('image/') ||
        file.type.startsWith('video/') ||
        file.type.startsWith('audio/')
      ) {
        const url = URL.createObjectURL(file);
        setFilePreviewUrl(url);
      }
    },
    [filePreviewUrl],
  );

  const handleEmbed = useCallback(async () => {
    if (inputMode === 'text') {
      return await embeddingService.embedText(inputText);
    } else if (selectedFile) {
      return await embeddingService.embedFile(selectedFile, inputText);
    }
    return null;
  }, [inputMode, inputText, selectedFile, embeddingService]);

  const handleAddToDatabase = useCallback(async () => {
    const result = await handleEmbed();
    if (result) {
      const label = inputMode === 'text' ? inputText : selectedFile!.name;
      databaseService.addItemFromEmbedding(
        result,
        label,
        inputMode,
        filePreviewUrl,
      );
    }
  }, [
    handleEmbed,
    inputMode,
    inputText,
    selectedFile,
    filePreviewUrl,
    databaseService,
  ]);

  const handleSearchDatabase = useCallback(async () => {
    const result = await handleEmbed();
    if (result) {
      const rawDatabase = databaseStore.state.items;
      databaseService.searchDatabase(rawDatabase, result);
    }
  }, [handleEmbed, databaseStore.state.items, databaseService]);

  const handleGenerateText = useCallback(async () => {
    if (selectedFile && inputText.trim()) {
      return await generationService.generateFileContent(
        selectedFile,
        inputText,
      );
    }
    return null;
  }, [selectedFile, inputText, generationService]);

  const handleReset = useCallback(() => {
    embeddingService.reset();
    generationService.reset();
    databaseService.clearSearch();
    setInputText('');
    setSelectedFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  }, [embeddingService, generationService, databaseService, filePreviewUrl]);

  return {
    inputMode,
    setInputMode,
    inputText,
    setInputText,
    selectedFile,
    setSelectedFile: handleFileChange,
    filePreviewUrl,

    embeddingResult: embeddingStore.queries.result,
    generationResult: generationStore.queries.result,
    databaseItems: databaseStore.queries.items,
    searchResults: databaseStore.queries.searchResults,
    searchOrder: databaseStore.queries.searchOrder,

    isLoading:
      embeddingStore.queries.isLoading || generationStore.queries.isLoading,
    error: embeddingStore.queries.error || generationStore.queries.error,

    handleEmbed,
    handleAddToDatabase,
    handleSearchDatabase,
    handleGenerateText,
    handleReset,
    setSearchOrder: databaseService.setSearchOrder,
  };
};
