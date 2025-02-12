import { useCallback, useState } from "react"

export const usePromisify = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [handleSubmit, setHandleSubmit] = useState<
    (option?: Record<string, unknown>) => void
  >(() => () => {});
  const [handleCancel, setHandleCancel] = useState<() => void>(
    () => () => {});
  const promisify = useCallback(() => {
    return new Promise((resolve) => {
      setHandleSubmit(() => (option) => {
        resolve({ ...option ,isCancel: true});
        setOpen(false);
      });
      setHandleCancel(() => () => {
        resolve({ isCancel: false });
        setOpen(false);
      });

      setOpen(true);
    });
  },[]);

  return {
    open,
    promisify,
    handleSubmit,
    handleCancel,
  }
}