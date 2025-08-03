export default function AuthPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="w-full px-6 py-4 shadow-md border-b bg-white flex justify-center items-center">
        <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>✏️</span> <span>Pen-Drawio</span>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
}
