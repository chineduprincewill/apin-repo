import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

export function exportTableToExcel(table, filename = "data") {
  const visibleColumns = table
    .getAllLeafColumns()
    .filter((col) => col.getIsVisible())
    .map((col) => col.id)

  const rows = table.getRowModel().rows

  const data = rows.map((row) => {
    const rowData = {}

    visibleColumns.forEach((col) => {
      rowData[col] = row.original[col]
    })

    return rowData
  })

  const worksheet = XLSX.utils.json_to_sheet(data)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  })

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  saveAs(blob, `${filename}.xlsx`)
}

export function exportFilteredRows(table) {
    const rows = table.getFilteredRowModel().rows
  
    const data = rows.map((row) => row.original)
  
    exportExcel(data, "filtered-data")
}

export function exportSelectedRows(table) {
    const rows = table.getSelectedRowModel().rows
  
    const data = rows.map((row) => row.original)
  
    exportExcel(data, "selected-rows")
}

function exportExcel(data, filename) {
    const worksheet = XLSX.utils.json_to_sheet(data)
  
    const workbook = XLSX.utils.book_new()
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    })
  
    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    })
  
    saveAs(blob, `${filename}.xlsx`)
}