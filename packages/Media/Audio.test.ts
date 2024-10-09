import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Audio } from './Audio';

describe('Audio', () => {
  let audio: Audio;

  beforeEach(() => {
    // AudioContextのモック
    const mockAudioContext = vi.fn().mockImplementation(() => ({
      decodeAudioData: vi.fn(),
      createBufferSource: vi.fn().mockReturnValue({
        buffer: null,
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        disconnect: vi.fn(),
      }),
      createMediaStreamSource: vi.fn(),
      destination: {},
      suspend: vi.fn().mockResolvedValue(undefined),
      resume: vi.fn().mockResolvedValue(undefined),
    }));

    // windowオブジェクトのモック
    global.window = {
      AudioContext: mockAudioContext,
      webkitAudioContext: mockAudioContext,
    } as any;

    // AudioContextのグローバル定義
    global.AudioContext = mockAudioContext;

    // navigatorオブジェクトのモック
    global.navigator = {
      mediaDevices: {
        getUserMedia: vi.fn(),
      },
    } as any;

    audio = new Audio();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (global as any).window;
    delete (global as any).AudioContext;
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
    
    vi.spyOn(audio.context, 'decodeAudioData').mockResolvedValue(mockAudioBuffer);
    const mockBufferSource = {
      buffer: null,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      disconnect: vi.fn(),
    };
    vi.spyOn(audio.context, 'createBufferSource').mockReturnValue(mockBufferSource as unknown as AudioBufferSourceNode);

    await audio.setAudio(mockArrayBuffer);

    expect(audio.audioSource).not.toBeNull();
    expect(audio.context.decodeAudioData).toHaveBeenCalledWith(mockArrayBuffer);
    expect(mockBufferSource.buffer).toBe(null);
  });

  it('デバイスの音声をセットすること', async () => {
    const mockStream = {} as MediaStream;
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(mockStream);
    vi.spyOn(audio.context, 'createMediaStreamSource').mockReturnValue({} as MediaStreamAudioSourceNode);

    const stream = await audio.setDeviceAudio();

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

    Object.defineProperty(audio._context, 'state', { value: 'suspended', writable: true });
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

    expect(mockStop).toHaveBeenCalled();
    expect(mockDisconnect).toHaveBeenCalled();
    expect(audio._audioSource?.buffer).toBeNull();
    expect(audio.isPlaying).toBe(false);
  });

  it('mediaSourceが存在する場合にデバイスの音声を停止すること', () => {
    const mockDisconnect = vi.fn();
    audio._mediaSource = {
      disconnect: mockDisconnect,
    } as unknown as MediaStreamAudioSourceNode;

    audio.stop();

    expect(mockDisconnect).toHaveBeenCalled();
    expect(audio._mediaSource).toBeNull();
    expect(audio.isPlaying).toBe(false);
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