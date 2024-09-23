import { useRef } from 'react'
import jsPDF from 'jspdf'
import autoTable, { UserOptions } from 'jspdf-autotable'

const usePdfGenerator = () => {
  const tableRef = useRef<HTMLTableElement>(null)
  const selectRoomRef = useRef<HTMLSelectElement>(null)
  const selectSemesterRef = useRef<HTMLSelectElement>(null)
  const selectCourseRef = useRef<HTMLSelectElement>(null)
  const imagePath = '/logo-saloc.png'

  const generatePdfReport = (
    reportType: 'room' | 'course',
    providedCourse?: string,
  ) => {
    const originalContent = tableRef.current
    const selectRoom = selectRoomRef.current
    const selectSemester = selectSemesterRef.current
    const selectCourse = selectCourseRef.current
    let select

    if (reportType === 'course') {
      select = selectCourse
    } else {
      select = selectRoom
    }

    if (selectSemester && originalContent && selectSemester.value !== '0') {
      const content = originalContent?.cloneNode(true) as HTMLTableElement
      const columnIndexToRemove = 9

      for (const row of content.rows) {
        if (row.cells.length > columnIndexToRemove) {
          row.deleteCell(columnIndexToRemove)
        }
      }

      const options = {
        filename:
          reportType === 'room'
            ? `${select?.options[select.selectedIndex].text}.pdf`
            : `${providedCourse || selectCourse?.options[selectCourse?.selectedIndex]?.text || 'Report'}.pdf`,
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
        jsPDFOptions: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'landscape' as const,
        },
      }

      // eslint-disable-next-line new-cap
      const doc = new jsPDF({
        unit: options.jsPDFOptions.unit,
        format: options.jsPDFOptions.format,
        orientation: options.jsPDFOptions.orientation,
      })

      const img = new Image()
      img.onload = () => {
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()

        const imgWidth = 50
        const imgHeight = (img.height / img.width) * imgWidth

        const x = pageWidth - imgWidth - options.margin.right
        const y = pageHeight - imgHeight - options.margin.bottom

        doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight)

        const styles: Partial<UserOptions['styles']> = {
          halign: 'center',
          valign: 'middle',
          cellPadding: 2,
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          cellWidth: 'auto',
          overflow: 'linebreak',
        }

        const room =
          reportType === 'room'
            ? select?.options[select.selectedIndex].text
            : ''
        const semester =
          selectSemester.options[selectSemester.selectedIndex].text
        const course =
          reportType === 'course'
            ? providedCourse ||
              select?.options[select.selectedIndex]?.text ||
              ''
            : ''

        const startY = semester ? options.margin.top + 10 : options.margin.top

        if (content instanceof HTMLTableElement) {
          autoTable(doc, {
            html: content,
            styles,
            startY,
            pageBreak: 'auto',
            margin: {
              top: startY,
              right: options.margin.right,
              bottom: options.margin.bottom + 13,
              left: options.margin.left,
            },
            didDrawPage: () => {
              doc.setFontSize(10)
              if (reportType === 'room') {
                doc.text(
                  `Sala: ${room}`,
                  options.margin.left,
                  options.margin.top + 5,
                )
              } else if (reportType === 'course') {
                doc.text(
                  `CURSO: ${course}`,
                  options.margin.left,
                  options.margin.top + 5,
                )
              }

              doc.text(
                `SEMESTRE: ${semester}`,
                options.margin.left + 244.5,
                options.margin.top + 5,
              )
              doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight)
            },
          })

          doc.save(options.filename)
        } else {
          console.error('The table content is not a valid HTMLTableElement.')
        }
      }

      img.src = imagePath
    }
  }

  return {
    tableRef,
    selectRoomRef,
    selectSemesterRef,
    selectCourseRef,
    generatePdfReport,
  }
}

export default usePdfGenerator
