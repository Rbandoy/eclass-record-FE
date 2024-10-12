<template>
  <div class="table-container">
    <input type="file" @change="onFileChange" />
    <button @click="exportToExcel" class="export-button">Export to Excel</button>
    <button @click="saveToExcel" class="save-button">Save Changes</button>
    <hot-table
      ref="hotTableRef"
      :data="data"
      :settings="hotSettings"
      :rowHeaders="true"
      :colHeaders="true"
      licenseKey="non-commercial-and-evaluation"
      class="hot-table"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import * as XLSX from 'xlsx';
import 'handsontable/dist/handsontable.full.css';
import { HyperFormula } from 'hyperformula';

// Register Handsontable's modules
registerAllModules();

export default defineComponent({
  components: {
    HotTable,
  },
  setup() {
    const hotTableRef = ref(null);
    const data = ref([]);
    const dataTable = ref([]);

    const hotSettings = ref({
      colHeaders: true,
      rowHeaders: true,
      mergeCells: true,
      manualColumnMove: true,
      manualColumnResize: true,
      manualRowResize: true,
      manualRowMove: true,
      contextMenu: true,
      hiddenColumns: {
        indicators: true,
      },
      formulas: {
        engine: HyperFormula,
      },
      cells: (row, col) => cellSettings(row, col),
    });

    const styles = ref({});

    const onFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const arrayBuffer = new Uint8Array(event.target.result);
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: false });
          const merges = firstSheet['!merges'] || [];
          styles.value = firstSheet['!cells'] || {};

          const processedData = processMergedCells(excelData, merges);
          data.value = processedData.data;
          hotSettings.value.mergeCells = processedData.mergeCells;
          const hotInstance = hotTableRef.value.hotInstance;

          if (hotInstance) {
            hotInstance.loadData(processedData.data);
            hotInstance.updateSettings({ cells: hotSettings.value.cells });
          }
        };

        reader.readAsArrayBuffer(file);
      }
    };

    const exportToExcel = () => {
      const wb = XLSX.utils.book_new(); // Create a new workbook
      const ws = XLSX.utils.aoa_to_sheet(data.value); // Convert data to a worksheet

      const mergeCells = hotTableRef.value.hotInstance.getSettings().mergeCells || [];
      if (mergeCells.length > 0) {
        ws['!merges'] = mergeCells.map(merge => ({
          s: { r: merge.row, c: merge.col },
          e: { r: merge.row + merge.rowspan - 1, c: merge.col + merge.colspan - 1 },
        }));
      }

      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append the worksheet to the workbook
      XLSX.writeFile(wb, 'exported_data.xlsx'); // Export the workbook as an Excel file
    };

    const saveToExcel = () => {
      const wb = XLSX.utils.book_new(); // Create a new workbook
      const ws = XLSX.utils.aoa_to_sheet(hotTableRef.value.hotInstance.getData()); // Get updated data from the table

      // Retain merged cells
      const mergeCells = hotTableRef.value.hotInstance.getSettings().mergeCells || [];
      if (mergeCells.length > 0) {
        ws['!merges'] = mergeCells.map(merge => ({
          s: { r: merge.row, c: merge.col },
          e: { r: merge.row + merge.rowspan - 1, c: merge.col + merge.colspan - 1 },
        }));
      }

      // Save the updated workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Updated Sheet');
      XLSX.writeFile(wb, 'updated_data.xlsx'); // Save the file as 'updated_data.xlsx'
    };

    const cellSettings = (row, col) => {
      const cellKey = XLSX.utils.encode_cell({ r: row, c: col });
      const cellStyle = dataTable.value[cellKey] || {};

      return {
        className: cellStyle.fill ? 'highlight-cell' : '',
        style: {
          fontFamily: 'Arial',
          fontSize: '12px',
          border: cellStyle.border ? formatBorders(cellStyle.border) : undefined,
        },
      };
    };

    const processMergedCells = (excelData, merges) => {
      const mergedData = excelData.map((row) =>
        row.map((cell) => (cell && typeof cell === 'object' ? cell.v : cell))
      );
      const mergeSettings = [];

      merges.forEach((merge) => {
        const { s: start, e: end } = merge;

        let mergedValue = mergedData[start.r][start.c];

        for (let row = start.r; row <= end.r; row++) {
          for (let col = start.c; col <= end.c; col++) {
            if (row === start.r && col === start.c) {
              mergedData[row][col] = mergedValue;
            } else {
              mergedData[row][col] = null;
            }
          }
        }

        mergeSettings.push({
          row: start.r,
          col: start.c,
          rowspan: end.r - start.r + 1,
          colspan: end.c - start.c + 1,
        });
      });

      return { data: mergedData, mergeCells: mergeSettings };
    };

    const formatBorders = (borders) => {
      const borderStyles = Object.entries(borders).map(([_, value]) => {
        console.log(_)
        const borderColor = value.color ? `#${value.color}` : 'black';
        const borderWidth = value.sz ? `${value.sz}px` : '1px';
        const borderStyle = value.dash ? 'dashed' : 'solid';

        return `${borderWidth} ${borderStyle} ${borderColor}`;
      });
      return borderStyles.join(', ');
    };

    return {
      hotTableRef,
      data,
      hotSettings,
      onFileChange,
      exportToExcel,
      saveToExcel,
    };
  },
});
</script>


<style scoped>
.table-container {
  width: 100%;
  height: 90%;
  padding-bottom: 50px;
}

.export-button, .save-button {
  margin-bottom: 10px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.export-button:hover, .save-button:hover {
  background-color: #45a049;
}

.hot-table {
  width: auto;
  min-width: 800px;
  height: 100%;
  overflow: auto;
}

.highlight-cell {
  background-color: lightblue;
}
</style>
