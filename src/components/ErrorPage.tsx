export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="text-gray-600">Page not found or an error occurred.</p>
      <a href="/" className="mt-4 text-blue-500 underline">Go back home</a>
    </div>
  );
}