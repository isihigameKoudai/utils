import { useCallback, useMemo, useRef, useState } from 'react';

import { defineChroma, defineChromaFromUrl } from '@/utils/db/chroma';
import type { Collection as ChromaCollection } from '@/utils/db/chroma';

import { geminiApi } from '../api';
import type { InputMode } from '../models/databaseItem';
import {
  createDatabaseService,
  createEmbeddingService,
  createGenerationService,
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

  const chromaCollectionRef = useRef<ChromaCollection | null>(null);

  const chromaOps = useMemo(() => {
    const c = defineChroma();
    return {
      addDocuments: c.addDocuments,
      getDocuments: c.getDocuments,
    };
  }, []);

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
    () =>
      createDatabaseService({
        actions: databaseStore.actions,
        chroma: chromaOps,
      }),
    [databaseStore.actions, chromaOps],
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

  const handleConnectChroma = useCallback(async () => {
    const { chromaUrl, chromaCollectionName } = databaseStore.state;
    databaseStore.actions.setChromaStatus('connecting');
    databaseStore.actions.setChromaError(null);

    try {
      const chroma = defineChromaFromUrl(chromaUrl);
      await chroma.connect();
      const collection =
        await chroma.getOrCreateCollection(chromaCollectionName);
      chromaCollectionRef.current = collection;
      databaseStore.actions.setChromaStatus('connected');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      databaseStore.actions.setChromaStatus('error');
      databaseStore.actions.setChromaError(msg);
    }
  }, [databaseStore.actions, databaseStore.state]);

  const handleAddToChroma = useCallback(async () => {
    if (!chromaCollectionRef.current) return;

    const result = await handleEmbed();
    if (result) {
      const label = inputMode === 'text' ? inputText : selectedFile!.name;
      await databaseService.addToChroma(
        chromaCollectionRef.current,
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

  const handleSearchChroma = useCallback(async () => {
    if (!chromaCollectionRef.current) return;

    const result = await handleEmbed();
    if (result) {
      await databaseService.searchChroma(chromaCollectionRef.current, result);
    }
  }, [handleEmbed, databaseService]);

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

    chromaUrl: databaseStore.queries.chromaUrl,
    chromaCollectionName: databaseStore.queries.chromaCollectionName,
    chromaStatus: databaseStore.queries.chromaStatus,
    chromaError: databaseStore.queries.chromaError,
    isChromaConnected: databaseStore.queries.isChromaConnected,
    setChromaUrl: databaseStore.actions.setChromaUrl,
    setChromaCollectionName: databaseStore.actions.setChromaCollectionName,

    isLoading:
      embeddingStore.queries.isLoading || generationStore.queries.isLoading,
    error: embeddingStore.queries.error || generationStore.queries.error,

    handleEmbed,
    handleAddToDatabase,
    handleSearchDatabase,
    handleConnectChroma,
    handleAddToChroma,
    handleSearchChroma,
    handleGenerateText,
    handleReset,
    setSearchOrder: databaseService.setSearchOrder,
  };
};
