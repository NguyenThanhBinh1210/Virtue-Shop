import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import { ProductListComfig } from 'src/types/product.type'
import useQueryParams from './useQueryParams'
export type QueryConfigS = {
  [key in keyof ProductListComfig]: string
}
export default function useQueryConfig() {
  const queryParams: QueryConfigS = useQueryParams()
  const queryConfig: QueryConfigS = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 8,
      sort_by: queryParams.sort_by,
      order: queryParams.order,
      category: queryParams.category,
      name: queryParams.name
    },
    isUndefined
  )
  return queryConfig
}
