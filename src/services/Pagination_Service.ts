class PaginationService {
  public paginateArray<T>(data: T[], page: number, limit: number) {
    const totalDocuments = data.length;
    const totalPages = Math.ceil(totalDocuments / limit);
    const skip = (page - 1) * limit;
    const paginatedData = data.slice(skip, skip + limit);

    return {
      data: paginatedData,
      totalDocuments,
      totalPages,
      currentPage: page,
      limit,
    };
  }
}

export default PaginationService;
