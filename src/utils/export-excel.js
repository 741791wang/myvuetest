import XLSX from 'xlsx'
/**
 * @description:
 * @param {Object} json 服务端发过来的数据
 * @param {String} name 导出Excel文件名字
 * @return:
 */
function exportExcel(json, name) {
  const ws = XLSX.utils.aoa_to_sheet(json)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS')
  /* generate file and send to client */
  XLSX.writeFile(wb, name + '.xlsx')
}

export default {
  exportExcel
}
