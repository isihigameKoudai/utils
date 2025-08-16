export type Option = {
  isMultiple?: boolean;
  accept?: string;
};

export type FetchFiles = (option?: Option) => Promise<{
  status: 'success' | 'error';
  files: File[];
}>;
