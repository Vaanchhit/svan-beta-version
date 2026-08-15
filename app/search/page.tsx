import { PageTransition } from "@/components/layout/page-transition";
import { SearchResults } from "@/components/search/search-results";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    genre?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const genre = params.genre ?? "";

  return (
    <PageTransition>
      <SearchResults query={query} genre={genre} />
    </PageTransition>
  );
}
