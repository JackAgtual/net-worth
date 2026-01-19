import { Dispatch, SetStateAction } from "react";

export function add(setter: Dispatch<SetStateAction<string[]>>) {
  setter((prev) => [...prev, crypto.randomUUID()]);
}

export function remove(setter: Dispatch<SetStateAction<string[]>>, id: string) {
  setter((prev) => prev.filter((cur) => cur !== id));
}
