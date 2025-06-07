import { Button } from "@/shadcn/ui/button";
import { Paperclip } from "lucide-react";
import { useRef, useState, type FC } from "react";

import styles from "./styles.module.scss";

type FileInputProps = {
  sendFile: (file: File) => void;
};

export const FileInput: FC<FileInputProps> = ({ sendFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileCount, setFileCount] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileCount(files.length);
      sendFile(files[0]);
    } else {
      setFileCount(0);
    }
  };

  return (
    <div className={styles["file-input-container"]}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className={styles["file-input"]}
          onChange={handleFileSelect}
        />
        <Paperclip className="h-5 w-5" />
      </Button>
      {fileCount > 0 && (
        <span className={styles["file-count"]}>{fileCount}</span>
      )}
    </div>
  );
};
