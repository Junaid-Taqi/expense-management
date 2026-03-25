export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    alert('No data to export');
    return;
  }
  
  // Extract headers
  const headers = Object.keys(data[0]).join(',');
  
  // Create rows
  const rows = data.map(item => {
    return Object.values(item).map(val => {
      // Escape commas in values by wrapping in quotes
      const strVal = String(val);
      if (strVal.includes(',') || strVal.includes('"')) {
        return `"${strVal.replace(/"/g, '""')}"`;
      }
      return strVal;
    }).join(',');
  });

  const csvContent = [headers, ...rows].join('\n');
  
  // Create a Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
