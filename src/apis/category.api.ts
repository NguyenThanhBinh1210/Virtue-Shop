import { CategoryList } from 'src/types/category.type'
import http from 'src/utils/http'

export const getCategories = () => http.get<CategoryList>('/category/get-all')
