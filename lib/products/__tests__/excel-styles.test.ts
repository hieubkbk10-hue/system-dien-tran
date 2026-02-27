import { Workbook } from 'exceljs';
import { describe, expect, it } from 'vitest';
import { getProductExcelColumns } from '../excel-contract';
import { buildProductTemplateSheet } from '../excel-styles';

const getNameColumnIndex = (columns: ReturnType<typeof getProductExcelColumns>) =>
  columns.findIndex((column) => column.key === 'name');

describe('buildProductTemplateSheet', () => {
  it('luôn có dòng ví dụ với full cột', () => {
    const workbook = new Workbook();
    const columns = getProductExcelColumns(new Set(['salePrice', 'stock', 'image', 'description']));
    const sheet = buildProductTemplateSheet(workbook, columns);

    expect(sheet.rowCount).toBeGreaterThan(1);
    const nameIndex = getNameColumnIndex(columns);
    expect(nameIndex).toBeGreaterThanOrEqual(0);
    const sampleName = sheet.getRow(2).getCell(nameIndex + 1).value;
    const lastExampleName = sheet.getRow(7).getCell(nameIndex + 1).value;
    expect(String(sampleName ?? '').trim().length).toBeGreaterThan(0);
    expect(String(lastExampleName ?? '').trim().length).toBeGreaterThan(0);
  });

  it('luôn có dòng ví dụ khi chỉ bật một phần cột', () => {
    const workbook = new Workbook();
    const columns = getProductExcelColumns(new Set(['salePrice']));
    const sheet = buildProductTemplateSheet(workbook, columns);

    expect(sheet.rowCount).toBeGreaterThan(1);
    const nameIndex = getNameColumnIndex(columns);
    expect(nameIndex).toBeGreaterThanOrEqual(0);
    const sampleName = sheet.getRow(2).getCell(nameIndex + 1).value;
    const lastExampleName = sheet.getRow(7).getCell(nameIndex + 1).value;
    expect(String(sampleName ?? '').trim().length).toBeGreaterThan(0);
    expect(String(lastExampleName ?? '').trim().length).toBeGreaterThan(0);
  });
});
