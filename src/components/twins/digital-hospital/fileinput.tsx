import { Callout, Card, Icon } from "@tremor/react";
import { AlertTriangle, Sheet } from "lucide-react";
import { useRef, type ChangeEvent } from "react";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/ui/tooltip";

interface FileUploadMultipleProps {
  multiple?: boolean;
  fileList: FileList | null;
  setFileList: (fileList: FileList | null) => void;
}

function FileUploadMultiple({
  multiple,
  fileList,
  setFileList,
}: FileUploadMultipleProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  // const handleUploadClick = () => {
  //   if (!fileList) {
  //     return;
  //   }

  //   // 👇 Create new FormData object and append files
  //   const data = new FormData();
  //   files.forEach((file, i) => {
  //     data.append(`file-${i}`, file, file.name);
  //   });

  //   // 👇 Uploading the files using the fetch API to the server
  //   // fetch("https://httpbin.org/post", {
  //   //   method: "POST",
  //   //   body: data,
  //   // })
  //   //   .then((res) => res.json())
  //   //   .then((data) => console.log(data))
  //   //   .catch((err) => console.error(err));
  // };

  // 👇 files is not an array, but it's iterable, spread to get an array of files
  const files = fileList ? [...fileList] : [];

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center space-x-4">
        {files.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => {
              if (!inputRef.current) return;
              inputRef.current.value = "";
              setFileList(null);
            }}
          >
            Remove
          </Button>
        )}
        <Input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          multiple={multiple}
          accept=".xls,.xlsx"
        />
      </div>

      {files.length > 0 && files.length < 6 && (
        <div className={"grid gap-4" + " grid-cols-" + String(files.length)}>
          {files.map((file, i) => (
            <FileRepresentation key={i} file={file} />
          ))}
        </div>
      )}
      {(files.length < 0 || files.length > 5) && files.length > 0 && (
        <Callout
          className="mt-4 h-12"
          title="Invalid Number of Files! Please select between 2 to 5 files."
          icon={AlertTriangle}
          color="rose"
        >
          Invalid Number of Files! Please select between 2 to 5 files.
        </Callout>
      )}
    </div>
  );
}

const FileRepresentation = ({ file }: { file: File; index?: number }) => {
  return (
    <Card className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-950">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger>
            <Icon
              icon={Sheet}
              className="duration-250 transform cursor-pointer rounded-md bg-green-600
			p-2 text-green-50 transition-all hover:scale-110
			dark:text-green-50
			"
              onClick={() => {
                // download file object
                const url = URL.createObjectURL(file);
                const a = document.createElement("a");
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
              }}
            />
          </TooltipTrigger>
          <TooltipContent>Click me to download</TooltipContent>
        </Tooltip>
      </TooltipProvider>
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

// const fileArrayToFileList = (files: File[]) => {
//   const data = new DataTransfer();
//   files.forEach((file) => data.items.add(file));
//   return data.files;
// };

export default FileUploadMultiple;
