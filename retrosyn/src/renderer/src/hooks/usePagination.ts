import { DataItem } from '@renderer/types'
import { useState, useEffect } from 'react'

const usePagination = (
  initData: DataItem[],
  itemsPerPage = 2,
  initPage = 1,
) => {
  const [currentPage, setCurrentPage] = useState<number>(initPage)
  const [data, setData] = useState<DataItem[]>(initData)

  useEffect(() => {
    const init = async () => {
      const res = await window.electronAPI.onGetFlowList()
      setData(res)
    }
    init()
  }, [])

  const updateData = (id: number, newPage = 1) => {
    const newData = data.filter((d) => d.id !== id)
    setData(newData)
    const upPages = Math.ceil(newData.length / itemsPerPage)
    if (newPage > upPages) {
      setCurrentPage(upPages)
    } else {
      setCurrentPage(newPage)
    }
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

  const totalPages = Math.ceil(data.length / itemsPerPage)

  const visibleData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return {
    currentPage,
    totalPages,
    visibleData,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    updateData,
  }
}

export default usePagination
