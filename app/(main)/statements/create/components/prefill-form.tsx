import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { redirect } from "next/navigation";

export default function PrefillForm({ years }: { years: number[] }) {
  async function onSubmit(formData: FormData) {
    "use server";

    const year = formData.get("year")?.toString() ?? "";

    const queryParams = new URLSearchParams({
      mode: "prefill",
      year,
    }).toString();

    redirect(`/statements/create?${queryParams}`);
  }

  return (
    <form className="flex gap-x-4" action={onSubmit}>
      <Select defaultValue={years[0].toString()} name="year">
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Select a year" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Year</SelectLabel>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="submit">Go</Button>
    </form>
  );
}
