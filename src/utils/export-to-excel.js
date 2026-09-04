import * as XLSX from 'xlsx';
import { toast } from 'sonner';

let isExportInProgress = false;

export const exportToExcel = async (data, config = {}) => {
  // Prevent multiple simultaneous exports
  if (isExportInProgress) {
    toast.error('Export is already in progress. Please wait.');
    return;
  }

  if (!data || data.length === 0) {
    toast.error('No data to export');
    return;
  }

  isExportInProgress = true;
  const loadingToastId = toast.loading('Preparing your export...');

  try {
    let worksheetData;
    let columnWidths = [];

    // Log what we received
    console.log('Export config received:', config);
    console.log('Columns received:', config.columns);

    if (config.columns && Array.isArray(config.columns) && config.columns.length > 0) {
      // Validate each column has an accessor function
      const validColumns = config.columns.filter(col => {
        const isValid = col && typeof col.accessor === 'function';
        if (!isValid) {
          console.warn('Invalid column skipped:', col);
        }
        return isValid;
      });

      if (validColumns.length === 0) {
        throw new Error('No valid columns with accessor functions found');
      }

      // Create header row
      const headers = validColumns.map(col => col.header);
      console.log('Headers:', headers);

      // Create data rows
      const dataRows = data.map(item => {
        return validColumns.map(col => {
          try {
            // Call the accessor function with the item
            const value = col.accessor(item);
            return value !== undefined && value !== null ? value : '';
          } catch (error) {
            console.error(`Error processing column ${col.header}:`, error);
            return 'Error';
          }
        });
      });

      // Combine headers and data
      worksheetData = [headers, ...dataRows];

      // Calculate column widths
      if (!config.skipAutoWidth) {
        columnWidths = validColumns.map((col, index) => {
          const columnData = dataRows.map(row => String(row[index] || ''));
          const maxWidth = Math.max(
            col.header.length,
            ...columnData.map(cell => cell.length)
          );
          return Math.min(50, Math.max(10, maxWidth + 2));
        });
      }
    } else {
      // Auto-generate from first item's keys
      console.log('No valid columns provided, auto-generating from data');
      const sampleItem = data[0];
      const headers = Object.keys(sampleItem);
      
      worksheetData = [
        headers,
        ...data.map(item => 
          headers.map(header => {
            const value = item[header];
            return value !== undefined && value !== null ? value : '';
          })
        )
      ];

      // Calculate column widths
      if (!config.skipAutoWidth) {
        columnWidths = headers.map(header => {
          const maxWidth = Math.max(
            header.length,
            ...data.map(item => {
              const value = item[header];
              return String(value || '').length;
            })
          );
          return Math.min(50, Math.max(10, maxWidth + 2));
        });
      }
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Apply column widths
    if (columnWidths.length > 0) {
      worksheet['!cols'] = columnWidths.map(width => ({ wch: width }));
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(
      workbook, 
      worksheet, 
      config.sheetName || 'Sheet1'
    );

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = config.filename 
      ? `${config.filename}-${timestamp}.xlsx`
      : `export-${timestamp}.xlsx`;

    // Write file
    XLSX.writeFile(workbook, filename);

    toast.dismiss(loadingToastId);
    toast.success(`Export completed! ${data.length} rows exported.`);
  } catch (error) {
    console.error('Error during Excel export:', error);
    toast.dismiss(loadingToastId);
    toast.error('An error occurred while exporting. Please try again.');
  } finally {
    isExportInProgress = false;
  }
};