import type { Workbook, Worksheet } from 'exceljs';
import type { ProductExcelColumn, ProductExcelColumnKey, ProductExcelStatus } from './excel-contract';
import { PRODUCT_STATUS_LABELS } from './excel-contract';

export type ProductExcelRow = Partial<Record<ProductExcelColumnKey, string | number | null>>;

const HEADER_FILL = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFF97316' },
} as const;

const HEADER_FONT = {
  color: { argb: 'FFFFFFFF' },
  bold: true,
} as const;

const HEADER_BORDER = {
  bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
} as const;

const HEADER_ALIGNMENT = { vertical: 'middle', horizontal: 'center', wrapText: true } as const;

export function buildProductTemplateSheet(workbook: Workbook, columns: ProductExcelColumn[]) {
  const sheet = workbook.addWorksheet('Products', { views: [{ state: 'frozen', ySplit: 1 }] });
  sheet.columns = columns.map((column) => ({
    header: column.label,
    key: column.key,
    width: column.width ?? 20,
  }));

  styleHeaderRow(sheet, columns.length);
  sheet.autoFilter = { from: { column: 1, row: 1 }, to: { column: columns.length, row: 1 } };
  applyNumberFormats(sheet, columns);
  addStatusValidation(sheet, columns);
  addExampleRow(sheet, columns);

  return sheet;
}

export function buildProductExportSheet(workbook: Workbook, columns: ProductExcelColumn[]) {
  const sheet = workbook.addWorksheet('Products', { views: [{ state: 'frozen', ySplit: 1 }] });
  sheet.columns = columns.map((column) => ({
    header: column.label,
    key: column.key,
    width: column.width ?? 20,
  }));

  styleHeaderRow(sheet, columns.length);
  sheet.autoFilter = { from: { column: 1, row: 1 }, to: { column: columns.length, row: 1 } };
  applyNumberFormats(sheet, columns);
  return sheet;
}

export function fillProductExportRows(sheet: Worksheet, columns: ProductExcelColumn[], rows: ProductExcelRow[]) {
  rows.forEach((row) => {
    sheet.addRow(columns.map((column) => row[column.key] ?? ''));
  });
  applyNumberFormats(sheet, columns);
}

export function buildGuideSheet(workbook: Workbook, columns: ProductExcelColumn[]) {
  const sheet = workbook.addWorksheet('HDSD');
  sheet.columns = [{ width: 90 }];

  sheet.addRow(['HƯỚNG DẪN IMPORT SẢN PHẨM']);
  sheet.addRow(['']);
  sheet.addRow([`1) Các cột bắt buộc: ${columns.filter((c) => c.required).map((c) => c.label).join(', ')}.`]);
  sheet.addRow(['2) Trạng thái hợp lệ: ' + Object.values(PRODUCT_STATUS_LABELS).join(', ') + '.']);
  sheet.addRow(['3) Slug danh mục phải là slug hiện có trong hệ thống (không dùng tên danh mục).']);
  sheet.addRow(['4) SKU/Slug bị trùng sẽ được bỏ qua khi import.']);
  sheet.addRow(['5) Giá bán/Tồn kho phải là số, không nhập ký tự đặc biệt.']);

  sheet.getRow(1).font = { bold: true, size: 14 };
  sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'left' };
  return sheet;
}

function styleHeaderRow(sheet: Worksheet, columnCount: number) {
  const headerRow = sheet.getRow(1);
  headerRow.height = 28;
  for (let i = 1; i <= columnCount; i += 1) {
    const cell = headerRow.getCell(i);
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.border = HEADER_BORDER;
    cell.alignment = HEADER_ALIGNMENT;
  }
}

function applyNumberFormats(sheet: Worksheet, columns: ProductExcelColumn[]) {
  columns.forEach((column, index) => {
    if (!column.numberFormat) {
      return;
    }
    sheet.getColumn(index + 1).numFmt = column.numberFormat;
  });
}

function addStatusValidation(sheet: Worksheet, columns: ProductExcelColumn[]) {
  const statusIndex = columns.findIndex((column) => column.key === 'status');
  if (statusIndex === -1) {
    return;
  }
  const statusValues = Object.values(PRODUCT_STATUS_LABELS).join(',');
  for (let rowIndex = 2; rowIndex <= 5001; rowIndex += 1) {
    sheet.getCell(rowIndex, statusIndex + 1).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [`"${statusValues}"`],
      showErrorMessage: true,
      errorTitle: 'Trạng thái không hợp lệ',
      error: 'Vui lòng chọn đúng trạng thái trong danh sách.',
    };
  }
}

function addExampleRow(sheet: Worksheet, columns: ProductExcelColumn[]) {
  const example: Record<ProductExcelColumnKey, string | number> = {
    name: 'Áo thun basic',
    slug: 'ao-thun-basic',
    sku: 'TSHIRT-001',
    categorySlug: 'thoi-trang',
    price: 199000,
    salePrice: 149000,
    stock: 50,
    status: PRODUCT_STATUS_LABELS.Active,
    image: 'https://example.com/images/ao-thun.jpg',
    description: 'Áo thun cotton mềm mại, dễ phối đồ.',
  };

  sheet.addRow(columns.map((column) => example[column.key] ?? ''));
}

export function getStatusLabel(status: ProductExcelStatus): string {
  return PRODUCT_STATUS_LABELS[status];
}
