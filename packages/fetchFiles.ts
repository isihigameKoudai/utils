type ImageDetail = ".jpeg" | ".jpg" | ".png" | ".gif";
type MovieDetail = ".mp4" | ".avi" | ".fiv" | ".mov" | ".wmv";
type AudioDetail =
  | ".wav"
  | ".mp3"
  | ".wma"
  | ".aac"
  | ".m4a"
  | ".flac"
  | ".ogg";
const imageDetails: ImageDetail[] = [".jpeg", ".jpg", ".png", ".gif"];
const movieDetails: MovieDetail[] = [".mp4", ".avi", ".fiv", ".mov", ".wmv"];
const audioDetails: AudioDetail[] = [
  ".wav",
  ".mp3",
  ".wma",
  ".aac",
  ".m4a",
  ".flac",
  ".ogg",
];

const IMAGE_TYPE = "image" as const;
const MOVIE_TYPE = "movie" as const;
const AUDIO_TYPE = "audio" as const;

type Option = {
  isMultiple?: boolean;
  fileType?: typeof IMAGE_TYPE | typeof MOVIE_TYPE | typeof AUDIO_TYPE;
  details?: ImageDetail[] | AudioDetail[] | MovieDetail[];
};

type FetchFiles = (option?: Option) => Promise<{
  status: string;
  files: File[];
}>;

const initialOption: Option = {
  isMultiple: false,
};

export const fetchFiles: FetchFiles = ({
  isMultiple = false,
  fileType,
  details,
} = initialOption) => {
  return new Promise((resolve, reject) => {
    const isAvailable: boolean = !!(
      window.File &&
      window.FileReader &&
      window.FileList &&
      window.Blob
    );
    if (!isAvailable) {
      reject({
        status: "The File APIs are not fully supported in this browser.",
        files: [],
      });
      return;
    }

    const $input: HTMLInputElement = document.createElement("input");
    $input.type = "file";
    $input.multiple = isMultiple;
    if (fileType && !details) {
      $input.accept = `${fileType}/*`;
      // TODO: detailsがある時ファイル拡張子を細かく指定できるようにする
    }
    $input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target || !target.files) {
        reject({
          status: "No Files",
          files: [],
        });
        return;
      }

      const files = [...target.files];
      resolve({
        status: "succeed",
        files,
      });
    };
    $input.click();
  });
};

export const fetchImage: FetchFiles = () => {
  return fetchFiles({ fileType: "image", isMultiple: false });
};

export const fetchImages: FetchFiles = () => {
  return fetchFiles({ fileType: "image", isMultiple: true });
};

export const fetchAudio: FetchFiles = () =>
  fetchFiles({ fileType: "audio", isMultiple: false });

export const fetchAudios: FetchFiles = () =>
  fetchFiles({ fileType: "audio", isMultiple: true });

export const fetchMovie: FetchFiles = () =>
  fetchFiles({ fileType: "audio", isMultiple: false });

export const fetchMovies: FetchFiles = () =>
  fetchFiles({ fileType: "audio", isMultiple: true });
