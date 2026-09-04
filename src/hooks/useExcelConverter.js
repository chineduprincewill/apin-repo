// hooks/useExcelConverter.js
import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

const useExcelConverter = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [workbook, setWorkbook] = useState(null);

    const convertToJson = useCallback((file, options = {}) => {
        return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
            const data = new Uint8Array(e.target.result);
            const wb = XLSX.read(data, { type: 'array' });
            setWorkbook(wb);
            
            const sheetName = options.sheetName || wb.SheetNames[0];
            const sheet = wb.Sheets[sheetName];
            
            const json = XLSX.utils.sheet_to_json(sheet, {
                header: options.header || 0,
                defval: options.defval || '',
                blankrows: options.blankrows || false,
                raw: options.raw !== undefined ? options.raw : true,
            });
            
            setData(json);
            resolve(json);
            } catch (err) {
            setError(err.message);
            reject(err);
            } finally {
            setLoading(false);
            }
        };
        
        reader.onerror = () => {
            const err = new Error('Failed to read file');
            setError(err.message);
            reject(err);
        };
        
        setLoading(true);
        reader.readAsArrayBuffer(file);
        });
    }, []);

    const getAllSheets = useCallback(() => {
        if (!workbook) return [];
        return workbook.SheetNames.map(name => ({
        name,
        data: XLSX.utils.sheet_to_json(workbook.Sheets[name])
        }));
    }, [workbook]);

    const clearData = useCallback(() => {
        setData(null);
        setWorkbook(null);
        setError(null);
    }, []);

    return {
        data,
        loading,
        error,
        convertToJson,
        getAllSheets,
        clearData,
    };
};

export default useExcelConverter;