import { SkeletonCard } from "./components/loading/skeleton-card";
import { SkeletonText } from "./components/loading/skeleton-text";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-y-6">
      <SkeletonText />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
