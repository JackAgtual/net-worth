import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { checkSession } from "@/lib/auth/auth-utils";
import { Statement } from "@/lib/db/models";
import dbConnect from "@/lib/db/mongodb";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import PrefillForm from "./prefill-form";
import { redirect } from "next/navigation";

export default async function ChooseMode() {
  await dbConnect();
  const session = await checkSession();

  const blankParams = new URLSearchParams({ mode: "blank" }).toString();
  const blankFormHref = `/statements/create?${blankParams}`;

  const statements = await Statement.find({ userId: session.user.id }).sort({
    year: -1,
  }); // select year not working
  const years = statements.map((statement) => statement.year);

  // User doesn't have any statements
  if (years.length === 0) {
    redirect(blankFormHref);
  }

  return (
    <>
      <div>Choose mode</div>
      <ItemGroup className="gap-y-2">
        <Item asChild variant="outline">
          <Link href={blankFormHref}>
            <ItemContent>
              <ItemTitle>Blank</ItemTitle>
              <ItemDescription>Start with an empty form</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ExternalLinkIcon />
            </ItemActions>
          </Link>
        </Item>
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Prefill</ItemTitle>
            <ItemDescription>
              Prefill the form with data from a previous statement
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <PrefillForm years={years} />
          </ItemActions>
        </Item>
      </ItemGroup>
    </>
  );
}
