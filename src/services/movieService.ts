import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";

interface TMDBResponse {
  page: number;
  total_pages: number;
  results: Movie[];
}

function getAuthHeader() {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  if (!token) {
    throw new Error(
      "VITE_TMDB_TOKEN is not defined. Set VITE_TMDB_TOKEN in your .env file."
    );
  }

  return { Authorization: `Bearer ${token}` };
}

const instanse = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: "application/json",
    ...getAuthHeader(),
  },
});

console.log("Axios instance created with config:", instanse.defaults);

async function fetchMovies(
  query: string,
  page: number = 1
): Promise<TMDBResponse> {
  const response = await instanse.get<TMDBResponse>("/search/movie", {
    params: { query, page },
  });

  const data = response.data;

  const movies = Array.isArray(data.results) ? data.results : [];
  const totalPages =
    typeof data.total_pages === "number" ? data.total_pages : 0;

  return {
    page: data.page || 1,
    total_pages: totalPages,
    results: movies,
  };
}

export default fetchMovies;
export { instanse };
