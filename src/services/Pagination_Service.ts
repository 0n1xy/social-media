// services/Pagination_Service.ts

import { Document, Model } from "mongoose";

class PaginationService {
  // Existing paginate method for querying the database
  public async paginate<T extends Document>(
    model: Model<T>,
    page: number,
    limit: number,
    query: Record<string, any> = {}
  ) {
    const skip = (page - 1) * limit;
    const totalDocuments = await model.countDocuments(query);
    const data = await model.find(query).skip(skip).limit(limit);
    const totalPages = Math.ceil(totalDocuments / limit);

    return {
      data,
      totalDocuments,
      totalPages,
      currentPage: page,
      limit,
    };
  }

  // New method to paginate an already fetched array of data
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
