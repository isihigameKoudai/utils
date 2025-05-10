export type Option = {
  isMultiple?: boolean;
  accept?: '*' | 'image/*' | 'audio/*' | 'video/*' | 'application/*';
};

export type FetchFiles = (option?: Option) => Promise<{
  status: 'success' | 'error';
  files: File[];
}>;
