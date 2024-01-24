import { DataItem } from '@renderer/types'
import { useState } from 'react'

const usePagination = (
  initData: DataItem[],
  itemsPerPage = 2,
  initPage = 1,
) => {
  const [currentPage, setCurrentPage] = useState<number>(initPage)
  const [data, setData] = useState<DataItem[]>(initData)

  const totalPages = Math.ceil(data.length / itemsPerPage)

  const visibleData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const updateData = (newData: DataItem[], newPage = 1) => {
    setData(newData)
    setCurrentPage(newPage)
  }

  const firstPage = () => {
    setCurrentPage(1)
  }

  const lastPage = () => {
    setCurrentPage(totalPages)
  }

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const previousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  return {
    currentPage,
    totalPages,
    visibleData,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    updateData,
    data,
  }
}

export default usePagination
