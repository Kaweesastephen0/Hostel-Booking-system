import SearchBar from '../components/layout/searchbar/searchBar';
import SearchResults from '../components/hostels/sections/searchResults/searchResults';
import { useHostelSearch } from '../hooks/useHostelSearch';

function SearchPage() {
  const { results, loading, error } = useHostelSearch();

  return (
    <>
      <SearchBar />
      <SearchResults 
        results={results} 
        loading={loading} 
        error={error} 
      />
    </>
  );
}