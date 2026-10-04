import { format } from "date-fns";

/**
 * Downloads an array of records as a JSON file.
 * @param {Array|Object} data - The data to export
 * @param {string} name - Base filename (without extension)
 */
export function downloadJSON(data, name) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${name}-${format(new Date(), "yyyy-MM-dd")}.json`;
  link.click();
}