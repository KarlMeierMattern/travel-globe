import { useQuery } from "@tanstack/react-query";

export default function App() {
  const { data, isLoading } = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const res = await fetch("/api/hello");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Message from Worker:</h1>
      <p>{data?.message}</p>
    </div>
  );
}
