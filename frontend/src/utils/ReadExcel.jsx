import * as XLSX from 'xlsx';

export const readExcel = (file, onSuccess, onError) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const workbook = XLSX.read(e.target.result, { type: 'binary' });
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = data[0];
    const rows = data.slice(1);

    const companiesData = rows.map((row) => {
      const company = headers.reduce((acc, header, index) => {
        acc[header] = row[index] || '';
        return acc;
      }, {});
      return company;
    });

    onSuccess(companiesData);
  };
  reader.onerror = onError;
  reader.readAsBinaryString(file);
};

export default readExcel