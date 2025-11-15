import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Audio } from './Audio';

import { mediaSourceMock, audioSourceMock } from '../__test__/mocks/media';
import { navigatorMock, windowMock } from '../__test__/mocks/global';

describe('Audio', () => {
  let audio: Audio;
  let mockContext: AudioContext;
  let mockMediaSource: MediaStreamAudioSourceNode;

  beforeEach(() => {
    // AudioContextのモック
    mockContext = {
      decodeAudioData: vi.fn(),
      createBufferSource: vi.fn().mockReturnValue({
        buffer: null,
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(), // stopメソッドを明示的にモック
        disconnect: vi.fn(),
      }),
      createMediaStreamSource: vi.fn(),
      destination: {},
      suspend: vi.fn().mockResolvedValue(undefined),
      resume: vi.fn().mockResolvedValue(undefined),
    } as unknown as AudioContext;

    // MediaStreamAudioSourceNodeのモック
    mockMediaSource = mediaSourceMock;
    // navigatorオブジェクトのモック
    global.navigator = navigatorMock;
    // windowオブジェクトのモック
    global.window = windowMock;
    // AudioContextのグローバル定義
    global.AudioContext = vi.fn().mockImplementation(() => mockContext);

    audio = new Audio();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).AudioContext;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).navigator;
  });

  it('AudioContextを作成すること', () => {
    expect(audio.context).toBeDefined();
  });

  it('デフォルト値で初期化されること', () => {
    expect(audio.audioSource).toBeNull();
    expect(audio.mediaSource).toBeNull();
    expect(audio.isPlaying).toBe(false);
  });

  it('ArrayBufferから音声をセットすること', async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    const mockAudioBuffer = {} as AudioBuffer;

    vi.spyOn(audio.context, 'decodeAudioData').mockResolvedValue(
      mockAudioBuffer,
    );
    const mockBufferSource = {
      buffer: null,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      disconnect: vi.fn(),
    };
    vi.spyOn(audio.context, 'createBufferSource').mockReturnValue(
      mockBufferSource as unknown as AudioBufferSourceNode,
    );

    await audio.setAudio(mockArrayBuffer);

    expect(audio.audioSource).not.toBeNull();
    expect(audio.context.decodeAudioData).toHaveBeenCalledWith(mockArrayBuffer);
    expect(mockBufferSource.buffer).not.toBeNull();
  });

  it('デバイスの音声をセットすること', async () => {
    const mockStream = {} as MediaStream;
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(
      mockStream,
    );
    vi.spyOn(audio.context, 'createMediaStreamSource').mockReturnValue(
      {} as MediaStreamAudioSourceNode,
    );

    const stream = await audio.getAudioStream();

    expect(stream).toBe(mockStream);
    expect(audio.mediaSource).not.toBeNull();
  });

  it('音声を再生すること', () => {
    const mockDisconnect = vi.fn();
    const mockConnect = vi.fn();
    const mockStart = vi.fn();
    audio._audioSource = {
      disconnect: mockDisconnect,
      connect: mockConnect,
      start: mockStart,
    } as unknown as AudioBufferSourceNode;

    audio.play();

    expect(mockDisconnect).toHaveBeenCalled();
    expect(mockConnect).toHaveBeenCalledWith(audio.context.destination);
    expect(mockStart).toHaveBeenCalledWith(0);
    expect(audio.isPlaying).toBe(true);
  });

  it('音声を一時停止および再開すること', async () => {
    const mockSuspend = vi.fn().mockResolvedValue(undefined);
    const mockResume = vi.fn().mockResolvedValue(undefined);
    audio._context = {
      suspend: mockSuspend,
      resume: mockResume,
      state: 'running',
    } as unknown as AudioContext;

    await audio.pause();
    expect(mockSuspend).toHaveBeenCalled();
    expect(audio.isPlaying).toBe(false);

    Object.defineProperty(audio._context, 'state', {
      value: 'suspended',
      writable: true,
    });
    await audio.pause();
    expect(mockResume).toHaveBeenCalled();
    expect(audio.isPlaying).toBe(true);
  });

  it('audioSourceが存在する場合に音声を停止すること', () => {
    const mockStop = vi.fn();
    const mockDisconnect = vi.fn();
    audio._audioSource = {
      stop: mockStop,
      disconnect: mockDisconnect,
      buffer: {} as AudioBuffer,
    } as unknown as AudioBufferSourceNode;

    audio.stop();

    expect(mockStop).toHaveBeenCalledWith(0); // stop(0)が呼ばれることを確認
    expect(mockDisconnect).toHaveBeenCalled();
    expect(audio._audioSource?.buffer).toBeNull();
    expect(audio.isPlaying).toBe(false);
  });

  it('mediaSourceが存在する場合にデバイスの音声を停止すること', async () => {
    // モックの設定
    const mockAudioSource = audioSourceMock;

    // AudioクラスのgetAudioStreamメソッドをモック
    const getAudioStreamMock = vi
      .spyOn(Audio.prototype, 'getAudioStream')
      .mockImplementation(async () => {
        audio['_mediaSource'] = mediaSourceMock;
        audio['_audioSource'] = audioSourceMock;
        return {} as MediaStream;
      });

    // getAudioStreamを呼び出してmediaSourceを設定
    await audio.setAudio(new ArrayBuffer(8));
    await audio.getAudioStream();
    // stopメソッドを呼び出す前の状態を確認
    expect(audio.audioSource).toBe(mockAudioSource);
    expect(audio.mediaSource).toBe(mockMediaSource);
    expect(audio.isPlaying).toBe(false);

    // stopメソッドを呼び出す
    audio.stop();

    // アサーション

    expect(audio.mediaSource).toBeNull();
    expect(audio.isPlaying).toBe(false);

    // モックをリストア
    getAudioStreamMock.mockRestore();
  });

  it('audioSourceが存在しない場合に音声を停止してもエラーが発生しないこと', () => {
    audio._audioSource = null;

    expect(() => audio.stop()).not.toThrow();
    expect(audio.isPlaying).toBe(false);
  });

  it('mediaSourceが存在しない場合にデバイスの音声を停止してもエラーが発生しないこと', () => {
    audio._mediaSource = null;

    expect(() => audio.stop()).not.toThrow();
    expect(audio.isPlaying).toBe(false);
  });
});
