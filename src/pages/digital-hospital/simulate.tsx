import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Callout,
  Card,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Title,
} from "@tremor/react";
import { Square, SquareStack } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Layout from "~/components/layout";
import FileUploadMultiple from "~/components/twins/digital-hospital/fileinput";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";
import { useToast } from "~/ui/use-toast";
// import { Button } from "~/ui/button";

const noWhitespace = (value: string) => !/\s/.test(value);

const formSchema = z.object({
  jobId: z
    .string()
    .min(3)
    .max(20)
    .nonempty()
    .refine(noWhitespace, "No whitespace allowed in Job ID")
    .optional(),
  timestamp: z
    .number()
    .int()
    .default(Math.floor(Date.now() / 1000)),
  weeks: z.number().int().min(1).max(10),
  files: z.custom<FileList>().nullable(),
  confidenceAnalysis: z.boolean().default(false),
});

export default function SimulatePage() {
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();

  const ProcessForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weeks: 3,
    },
  });

  const fileList = ProcessForm.watch("files");
  const setFileList = (files: FileList | null) => {
    ProcessForm.setValue("files", files);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.files) {
      toast.toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
    } else {
      toast.toast({
        title: "Data",
        description: (
          <span className="whitespace-break-spaces font-mono">
            {JSON.stringify(values, null, 2)}
          </span>
        ),
      });
    }

    console.log(values);
  }

  return (
    <Layout title="Run Simulation">
      <TabGroup
        index={tabIndex}
        onIndexChange={(index) => {
          setFileList(null);
          setTabIndex(index);
        }}
      >
        <TabList variant="solid">
          <Tab
            icon={Square}
            className={
              tabIndex === 0
                ? "border-[1px] border-gray-200 bg-white text-black dark:border-black dark:bg-background dark:text-gray-300"
                : ""
            }
          >
            Single Simulation
          </Tab>
          <Tab
            icon={SquareStack}
            className={
              tabIndex === 1
                ? "border-[1px] border-gray-200 bg-white text-black dark:border-black dark:bg-background dark:text-gray-300"
                : ""
            }
          >
            Scenario Analysis
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card className="px-8">
              <Title>Single File Upload</Title>
              <FileUploadMultiple
                fileList={fileList}
                setFileList={setFileList}
              />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="px-8">
              <Title>Multi File Upload</Title>
              <Callout
                title="Please name the files in the following format: 1.xlsx, 2.xlsx, 3.xlsx, 4.xlsx, 5.xlsx for the scenario number"
                className="my-4 bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200"
              ></Callout>
              <FileUploadMultiple
                multiple
                fileList={fileList}
                setFileList={setFileList}
              />
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <Form {...ProcessForm}>
        <form
          onSubmit={(e) => {
            void ProcessForm.handleSubmit(onSubmit)(e);
          }}
        >
          <Card className="mt-4 flex flex-col space-y-4 p-8">
            <Title>Configurations</Title>
            <div className="flex items-start space-x-4 align-top">
              {/* <FormField
                control={ProcessForm.control}
                name="jobId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Id</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>Name of the job to be run</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={ProcessForm.control}
                name="weeks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Weeks</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                        }}
                        defaultValue={String(field.value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="3" />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                            <SelectItem key={item} value={String(item)}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      <span className="whitespace-break-spaces">
                        {`Number of weeks to run\nthe simulation for`}
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={ProcessForm.control}
                name="confidenceAnalysis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidence Analysis</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value === "Yes");
                        }}
                        defaultValue={field.value ? "Yes" : "No"}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="1" />
                        </SelectTrigger>
                        <SelectContent>
                          {["No", "Yes"].map((item) => (
                            <SelectItem key={item} value={String(item)}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      <span className="whitespace-break-spaces">
                        {`Run confidence analysis on the simulation\n(This takes much longer to run, only use this after you have run the simulation without it)`}
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button color="emerald" type="submit">
              Run Simulation
            </Button>
          </Card>
        </form>
      </Form>
    </Layout>
  );
}
