import Link from "next/link";
import { Button } from "../ui/button";

export default function NoStatements() {
  return (
    <>
      <p>You don't have any statements</p>
      <Link href={"statements/create"}>
        <Button>Create a new statement</Button>
      </Link>
    </>
  );
}
