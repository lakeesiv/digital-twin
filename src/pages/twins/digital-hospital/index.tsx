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
import { Input } from "~/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";
// import { Button } from "~/ui/button";

const noWhitespace = (value: string) => !/\s/.test(value);

const formSchema = z.object({
  jobId: z
    .string()
    .min(3)
    .max(20)
    .nonempty()
    .refine(noWhitespace, "No whitespace allowed in Job ID"),
  weeks: z.number().int().min(1).max(10),
  files: z.custom<FileList>(),
});

export default function Home() {
  const [tabIndex, setTabIndex] = useState(0);

  const ProcessForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weeks: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Layout title="Digital Twin">
      <TabGroup
        color="amber"
        index={tabIndex}
        onIndexChange={(index) => setTabIndex(index)}
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
              <FileUploadMultiple />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="px-8">
              <Title>Multi File Upload</Title>
              <Callout
                title="Please name the files in the following format: 1.xlsx, 2.xlsx, 3.xlsx, 4.xlsx, 5.xlsx for the scenario number"
                className="my-4 bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200"
              ></Callout>
              <FileUploadMultiple multiple />
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <Form {...ProcessForm}>
        <form
          // onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          //   e.preventDefault();
          //   console.log(ProcessForm.getValues());
          //   ProcessForm.handleSubmit(onSubmit);
          // }}
          onSubmit={(e) => {
            void ProcessForm.handleSubmit(onSubmit)(e);
          }}
        >
          <Card className="mt-4 flex flex-col space-y-4 p-8">
            <Title>Configurations</Title>
            <div className="flex items-start space-x-4 align-top">
              <FormField
                control={ProcessForm.control}
                name="jobId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Id</FormLabel>
                    <FormControl>
                      <Input placeholder="test-123" {...field} />
                    </FormControl>
                    <FormDescription>Name of the job to be run</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          <SelectValue placeholder="1" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                            <SelectItem key={item} value={String(item)}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Number of Weeks to run the simulation for
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
