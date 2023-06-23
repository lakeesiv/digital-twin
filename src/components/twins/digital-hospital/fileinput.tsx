import { Card, Icon } from "@tremor/react";
import { Sheet, Upload } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { Input } from "~/ui/input";

interface FileUploadMultipleProps {
  multiple?: boolean;
}

function FileUploadMultiple({ multiple }: FileUploadMultipleProps) {
  const [fileList, setFileList] = useState<FileList | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
  };

  const handleUploadClick = () => {
    if (!fileList) {
      return;
    }

    // 👇 Create new FormData object and append files
    const data = new FormData();
    files.forEach((file, i) => {
      data.append(`file-${i}`, file, file.name);
    });

    // 👇 Uploading the files using the fetch API to the server
    // fetch("https://httpbin.org/post", {
    //   method: "POST",
    //   body: data,
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log(data))
    //   .catch((err) => console.error(err));
  };

  // 👇 files is not an array, but it's iterable, spread to get an array of files
  const files = fileList ? [...fileList] : [];

  return (
    <div className="space-y-4">
      <Input
        type="file"
        onChange={handleFileChange}
        multiple={multiple}
        accept=".xls,.xlsx"
      />

      {files.length > 0 && (
        <div className={"grid gap-4" + " grid-cols-" + String(files.length)}>
          {files.map((file, i) => (
            <FileRepresentation key={i} file={file} />
          ))}
        </div>
      )}

      <button onClick={handleUploadClick}>Upload</button>
    </div>
  );
}

const FileRepresentation = ({ file }: { file: File }) => {
  return (
    <Card className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-950">
      <Icon
        icon={Sheet}
        className="rounded-md bg-green-600 p-2 text-green-50 dark:text-green-50"
      />
      <div className="flex flex-col">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {file.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {file.size} bytes
        </p>
      </div>
    </Card>
  );
};

export default FileUploadMultiple;
