export interface PaginationMetadata {
    totalElements: number; // Total number of records in the database
    totalPages: number; // Total number of pages
    currentPage: number; // Current page number
    pageSize: number; // Records per page
    last?: boolean; // Optional: Indicates if this is the last page
  }
  export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    metadata: PaginationMetadata;
}