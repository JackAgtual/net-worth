export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md mx-3">{children}</div>
    </div>
  );
}
