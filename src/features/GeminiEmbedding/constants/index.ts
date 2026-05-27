export const SUPPORTED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  video: ['video/mp4', 'video/mov', 'video/mpeg', 'video/avi', 'video/webm'],
  audio: ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/mpeg'],
  pdf: ['application/pdf'],
};

export const ALL_SUPPORTED_TYPES = [
  ...SUPPORTED_MIME_TYPES.image,
  ...SUPPORTED_MIME_TYPES.video,
  ...SUPPORTED_MIME_TYPES.audio,
  ...SUPPORTED_MIME_TYPES.pdf,
].join(',');
