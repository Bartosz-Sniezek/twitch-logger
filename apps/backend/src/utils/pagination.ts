export interface Paginated<T> {
  data: T[];
  page: number;
  per_page: number;
  total_count: number;
}
