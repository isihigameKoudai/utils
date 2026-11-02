import { defineGemini } from '@/utils/ai/google';

import type { EmbeddingResultParams } from '../models/embeddingResult';
import type { GenerationResultParams } from '../models/generationResult';

/**
 * Gemini API キーはこのブラウザの localStorage にのみ保持し、
 * サーバーやビルド成果物（VITE_* 環境変数）には載せない。
 */
const API_KEY_STORAGE_KEY = 'gemini-embedding.api-key';

let client: ReturnType<typeof defineGemini> | null = null;

const readApiKey = (): string => {
	if (typeof window === 'undefined') return '';
	return window.localStorage.getItem(API_KEY_STORAGE_KEY) ?? '';
};

const getClient = (): ReturnType<typeof defineGemini> => {
	const apiKey = readApiKey();
	if (!apiKey) {
		throw new Error(
			'Gemini API キーが設定されていません。ページ上部でキーを入力してください。',
		);
	}

	if (!client) {
		client = defineGemini({
			root: { apiKey },
			embedding: { outputDimensionality: 768 },
		});
	}
	return client;
};

/** ユーザーが入力した API キーをこのブラウザに保存する */
export const setGeminiApiKey = (apiKey: string): void => {
	window.localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
	client = null;
};

/** 現在設定されている API キーを返す */
export const getGeminiApiKey = (): string => readApiKey();

export const geminiApi = {
	async embed(text: string): Promise<EmbeddingResultParams> {
		const startTime = performance.now();
		const response = await getClient().embed(text);

		const values = response.embeddings?.[0]?.values ?? [];
		const executionTimeMs = performance.now() - startTime;

		return {
			values,
			dimensions: values.length,
			model: 'gemini-embedding-2',
			executionTimeMs,
		};
	},

	async embedFile(file: File, text?: string): Promise<EmbeddingResultParams> {
		const startTime = performance.now();
		const response = await getClient().embedFile(file, text);

		const values = response.embeddings?.[0]?.values ?? [];
		const executionTimeMs = performance.now() - startTime;

		return {
			values,
			dimensions: values.length,
			model: 'gemini-embedding-2',
			executionTimeMs,
		};
	},

	async generateFile(
		file: File,
		text: string,
	): Promise<GenerationResultParams> {
		const startTime = performance.now();
		const response = await getClient().generateFile(file, text);
		const executionTimeMs = performance.now() - startTime;

		return {
			text: response.text || '',
			model: 'gemini-3-flash-preview',
			executionTimeMs,
		};
	},
};
