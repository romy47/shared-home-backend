import { Injectable } from '@nestjs/common';
import { PaginatedResponse, PaginationParams } from './pagination-metadata';

@Injectable()
export class PaginationService {
    async paginate<T>(
        prismaModel: any, 
        params: PaginationParams = {},
        additionalQuery: any = {}

    ): Promise<PaginatedResponse<T>> {
        const {
            page = 1,
            pageSize = 10,
            sortBy = 'id',
            sortOrder = 'desc'
          } = params; //defaulting to this values if nothing passed
        
          const skip = (page - 1) * pageSize;
        
          // Merge additional query with pagination
          const fullQuery = {
            ...additionalQuery,
            skip,
            take: pageSize,
            orderBy: additionalQuery.orderBy || { [sortBy]: sortOrder }
          };
        
       
          const totalElements = await prismaModel.count({
            where: additionalQuery.where || {}
          });
        
          const totalPages = Math.ceil(totalElements / pageSize);
        
       
          const data = await prismaModel.findMany(fullQuery);
        
          return {
            data,
            metadata: {
              totalElements,
              totalPages,
              currentPage: page,
              pageSize: pageSize,
              last: page === totalPages
            }
          };
    }
}