<template>
  <div class="table-container">
   
    <div class="flex flex-row gap-2"> 
      <h1 class="bold text-lg">Active: <strong>{{ activeSchoolYear.sem }} SEM. A.Y.  {{ activeSchoolYear.year }} </strong></h1>
    
      <label for="file-select" class="file-select-label">Select Class Records:</label>
      <select id="file-select" v-model="selectedFile" @change="loadFile" class="file-select">
        <option value="" disabled>Select a file</option>
        <option v-for="file in files" :key="file.name" :value="file">{{ file.name }}</option>
      </select>
      <button @click="fetchDefaultExcel" class="save-button ">Class Record</button>
      <button @click="openRenameModal" class="save-button ">Save Changes</button>
      <button @click="submitToAdmin" class="save-button">Submit Grades</button>
      <button @click="deleteFile" v-if="selectedFile?.id" class="save-button">Delete File</button>
     </div>
    <!-- Custom File Import Button -->
    <!-- <label class="custom-file-upload  save-button">
      <input type="file" @change="onFileChange" />
      Import File
    </label> -->
    <!-- <button @click="exportToExcel" class="export-button ">Export to Excel</button> -->
    
  
    

    <div v-if="isRenameModalVisible" class="rename-modal">
      <div class="rename-content">
        <h3>Rename File</h3>
        <input v-model="newFileName" placeholder="Save File?" />
        <button @click="renameFile">Save</button>
        <button @click="closeRenameModal">Cancel</button>
      </div>
    </div>

    <!-- Loading Modal -->
    <div v-if="loading" class="loading-modal">
      <div class="loading-content">
        <div class="spinner"></div>
      </div>
    </div>  

   <div class="hot-table"> 
    <hot-table 
    ref="hotTableRef"
    :data="data"
    :settings="hotSettings"
    :rowHeaders="true"
    :colHeaders="true" 
    licenseKey="non-commercial-and-evaluation"
    class="overflow-auto"
  />
   </div>
    <div v-if="selectedFile" class="zoom-controls">
      <!-- Zoom In button with SVG -->
      <!-- <button @click="zoomIn" aria-label="Zoom In">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-5H6v-2h5V6h2v5h5v2h-5v5z"/>
        </svg>
      </button> -->
  
      <!-- Zoom Out button with SVG -->
      <!-- <button @click="zoomOut" aria-label="Zoom Out">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
        </svg>
      </button> -->
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import * as XLSX from 'xlsx';
import 'handsontable/dist/handsontable.full.css';
import { HyperFormula } from 'hyperformula';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
// Register Handsontable's modules
registerAllModules();

export default defineComponent({
  components: {
    HotTable,
  },
  setup() {
    const hotTableRef = ref(null);
    const data = ref([]);
    const files = ref([]);
    const activeSchoolYear = ref('');
    const selectedFile = ref(null);
    const zoomLevel = ref(1); // New state variable for zoom level
    const loading = ref(false); // New loading state
    const isRenameModalVisible = ref(false);
    const newFileName = ref('');
    const styles = ref({ /* define your style object here */ });
    const extension = ref(`@${JSON.parse(sessionStorage.getItem("profile")).id}`)

    const focusedCell = reactive({ row: null, col: null });

    const onCellSelect = (row, col) => {
      focusedCell.row = row;
      focusedCell.col = col; 
    };

    const onCellChange = async (changes) => {
  const hotInstance = hotTableRef.value.hotInstance;
  
  if (changes && changes.length) {
    for (const [row, col, oldValue, newValue] of changes) { 
      
      // Check if the value has changed in the target column (0 in this example)
      if (oldValue !== newValue && col === 0 && row > 9) { 

        const nextCol = col + 1;

        // Check if the right cell exists before attempting update
        if (hotInstance && hotInstance.getDataAtCell(row, nextCol) !== undefined) {
          // Optional: Set a temporary loading indicator
          hotInstance.setDataAtCell(row, nextCol, "Loading...");

          try {
            // Call the API and wait for the data
            const loadedData = await loadStudents(newValue);

            // Update the adjacent cell with the received data
            const studentName = `${loadedData}`;
            hotInstance.setDataAtCell(row, nextCol, studentName  == "undefined" ? "": studentName);
            hotInstance.setDataAtCell(row, 27, studentName  == "undefined" ? "": studentName);
            hotInstance.setDataAtCell(row, 54, studentName  == "undefined" ? "": studentName);
          } catch (error) {
            console.error("Error loading data:", error);
            // Optional: Display error text or keep previous value 
          }
        }
      }
    }
  }
};


    const loadStudents = async (student_id) => {
      try { 
        const token = sessionStorage.getItem('jwt');
        const response = await axios.get(`https://api.nemsu-grading.online/api/students?filters[student_id][$eq]=${student_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        return `${response.data.data[0].attributes.lname}, ${response.data.data[0].attributes.fname} ${response.data.data[0].attributes.mname}`; // Adjust based on the actual response structure
      } catch (error) {
        console.error('Error fetching students:', error);
      }  
    };
    
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
      width: '100%',
      height: '100%',
      cells(row, col) {
        const cellProperties = {};
        console.log(row,col)
        cellProperties.renderer = customCellRenderer;
        return cellProperties;
      },
      afterChange: onCellChange,
      afterSelection: onCellSelect,
    });

    
 

    const openRenameModal = () => {
      if (selectedFile.value) { 
        newFileName.value = selectedFile.value.name; // Pre-fill the current name
        isRenameModalVisible.value = true;
      }
    };

  const closeRenameModal = () => {
    isRenameModalVisible.value = false;
  };

  const renameFile = async () => { 
    isRenameModalVisible.value = false; 
    saveToExcel()
  };

    // Fetch files function
    const fetchFiles = async () => {
      files.value = []
      // const token = sessionStorage.getItem('jwt');
      try {
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'https://api.nemsu-grading.online/api/upload/files/'
        };
        const response = await axios.request(config);
        files.value = response.data.reduce((acc, cur) => {
          
          if (cur?.name.includes(extension.value) && !cur?.name.includes("default")) {
            cur.name = cur.name.replace(extension.value, "")
            
            acc.push(cur);
          }
          return acc; // You must return the accumulator
        }, []) || [];

      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    const fetchDefaultExcel = async () => { 
      try {
          loading.value = true; // Start loading
          const response = await fetch(`https://api.nemsu-grading.online/uploads/Book2_3a0d84028b.xlsx`);
          if (!response.ok) throw new Error('Network response was not ok');
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: false });
          const merges = firstSheet['!merges'] || [];
          const workbook2 = new ExcelJS.Workbook();
    
        // Load the workbook from the ArrayBuffer
        await workbook2.xlsx.load(arrayBuffer);

        // Access the first worksheet
        const worksheet = workbook2.worksheets[0];

              console.log(worksheet.model.rows)
            
              const processedData = processMergedCells(excelData, merges);
              addFormula(worksheet, processedData.data)
              console.log("default", processedData)
              data.value = processedData.data;
              hotSettings.value.mergeCells = processedData.mergeCells;
              const hotInstance = hotTableRef.value.hotInstance;
              selectedFile.value = response
              if (hotInstance) {
                hotInstance.loadData(processedData.data);
                hotInstance.updateSettings({ cells: hotSettings.value.cells });
                loading.value = false; // Start loading
              }
            } catch (error) {
              console.error('Error loading file:', error);
      
              const hotInstance = hotTableRef.value.hotInstance;
              if (hotInstance) {
                hotInstance.loadData([]);
                hotInstance.updateSettings({ cells: hotSettings.value.cells });
                loading.value = false; // Start loading
              } 
              loading.value = false 
          }
    }


    // Load file function
    const loadFile = async () => {
      if (selectedFile.value) {
        // try {
          try {
          loading.value = true; // Start loading
          const response = await fetch(`https://api.nemsu-grading.online${selectedFile.value.url}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: false });
          const merges = firstSheet['!merges'] || [];
          const workbook2 = new ExcelJS.Workbook();
    
        // Load the workbook from the ArrayBuffer
        await workbook2.xlsx.load(arrayBuffer);

        // Access the first worksheet
        const worksheet = workbook2.worksheets[0];

              console.log(worksheet.model.rows)
            
              const processedData = processMergedCells(excelData, merges);
              addFormula(worksheet, processedData.data)
              console.log("default", processedData)
              data.value = processedData.data;
              hotSettings.value.mergeCells = processedData.mergeCells;
              const hotInstance = hotTableRef.value.hotInstance;
              selectedFile.value = response
              if (hotInstance) {
                hotInstance.loadData(processedData.data);
                hotInstance.updateSettings({ cells: hotSettings.value.cells });
                loading.value = false; // Start loading
              }
          } catch (error) {
              console.error('Error loading file:', error);
      
              const hotInstance = hotTableRef.value.hotInstance;
              if (hotInstance) {
                hotInstance.loadData([]);
                hotInstance.updateSettings({ cells: hotSettings.value.cells });
                loading.value = false; // Start loading
              } 
              loading.value = false 
          }
        //   loading.value = true; // Start loading
        //   const response = await fetch(`https://api.nemsu-grading.online${selectedFile.value.url}`);
        //   if (!response.ok) throw new Error('Network response was not ok');

        //   const arrayBuffer = await response.arrayBuffer();
        //   const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        //   const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        //   const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: false });
        //   const merges = firstSheet['!merges'] || [];

        //   const processedData = processMergedCells(excelData, merges);
        //   data.value = processedData.data;
        //   hotSettings.value.mergeCells = processedData.mergeCells;
        //   const hotInstance = hotTableRef.value.hotInstance;

        //   if (hotInstance) {
        //     hotInstance.loadData(processedData.data);
        //     hotInstance.updateSettings({ cells: hotSettings.value.cells });
        //     loading.value = false; // Start loading
        //   }
        // } catch (error) {
        //   console.error('Error loading file:', error);
  
        //   const hotInstance = hotTableRef.value.hotInstance;
        //   if (hotInstance) {
        //     hotInstance.loadData([]);
        //     hotInstance.updateSettings({ cells: hotSettings.value.cells });
        //     loading.value = false; // Start loading
        //   } 
        //   loading.value = false 
        // }
      }
    };

    const fetchSchoolYear = async () => {
      let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'https://api.nemsu-grading.online/api/school-years?filters[active][$eq]=active',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`
          }
        };

        const sy = await axios.request(config)
        
        activeSchoolYear.value = sy.data.data[0].attributes
    }

    // Handle file change
    const onFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          loading.value = true
          selectedFile.value = file
          
          const arrayBuffer = new Uint8Array(event.target.result);
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: false });
          const merges = firstSheet['!merges'] || [];

          const processedData = processMergedCells(excelData, merges);
          data.value = processedData.data;
          hotSettings.value.mergeCells = processedData.mergeCells;
          const hotInstance = hotTableRef.value.hotInstance;

          if (hotInstance) { 
            hotInstance.loadData(processedData.data);
            hotInstance.updateSettings({ cells: hotSettings.value.cells });
            loading.value = false; // Start loading
          }
        };

        reader.readAsArrayBuffer(file);
      }
    };

    // Export to Excel
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

    // Save changes to Excel
   // Save changes to Excel
const saveToExcel = async () => {
  
  if (selectedFile.value.length == 0) return
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data.value);
  loading.value = true
  // Get merged cells from the Handsontable instance
  const mergeCells = hotTableRef.value.hotInstance.getSettings().mergeCells || [];
  if (mergeCells.length > 0) {
    ws['!merges'] = mergeCells.map(merge => ({
      s: { r: merge.row, c: merge.col },
      e: { r: merge.row + merge.rowspan - 1, c: merge.col + merge.colspan - 1 },
    }));
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Convert workbook to binary string
  const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  const blob = new Blob([s2ab(excelData)], { type: 'application/octet-stream' });

  // Prepare FormData to send to the server
  const formData = new FormData();
 
  formData.append('files', blob, newFileName.value+""+extension.value); // Change filename if needed

  try {
    try {
      await axios.delete(`https://api.nemsu-grading.online/api/upload/files/${selectedFile.value.id}`)
    } catch (error) {
      // 
    }

    
    
    // Make an API request to Strapi to save the file
    const response = await fetch('https://api.nemsu-grading.online/api/upload/', {
      method: 'POST',
      body: formData,
      // Uncomment if you need to send authorization token
      // headers: { 'Authorization': `Bearer ${token}` },
    });

          await response.json();
    
  } catch (error) {
    console.error('Error saving file:', error);
  } finally { 
    const hotInstance = hotTableRef.value.hotInstance;

    if (hotInstance) {
      hotInstance.loadData([]);
      hotInstance.updateSettings({ cells: hotSettings.value.cells });
      loading.value = false; // Start loading
    }
    selectedFile.value = []
    loading.value = false
    isRenameModalVisible.value =false
    fetchFiles()
  }
};

const deleteFile = async () => {
  try {
      await axios.delete(`https://api.nemsu-grading.online/api/upload/files/${selectedFile.value.id}`)
    } catch (error) {
      // 
    } finally { 
    const hotInstance = hotTableRef.value.hotInstance;
    if (hotInstance) {
      hotInstance.loadData([]);
      hotInstance.updateSettings({ cells: hotSettings.value.cells });
      loading.value = false; // Start loading
    }
    selectedFile.value = []
    loading.value = false
    isRenameModalVisible.value =false
    fetchFiles()
  }
}

const submitToAdmin = async () => {
  
    const semester = data.value[8][6].charAt(0); 
    const schoolYear = data.value[8][6].match(/\d{4}-\d{4}/)[0];

    const response = await axios.get(`https://api.nemsu-grading.online/api/school-years?filters[year][$eq]=${schoolYear}&filters[sem][$eq]=${semester}&filters[active][$eq]=true`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
      }
    });

    if (response.data.data.length < 1) {
      alert("School year not active")
      return
    }

  const students = data.value.reduce((acc, cur, index) => {
    if (index > 11 && ["PASSED", "FAILED", "INC", "N/A"].includes(cur[7])) {

      const semester = data.value[8][6].charAt(0); 
      const schoolYear = data.value[8][6].match(/\d{4}-\d{4}/)[0]; 
 

      acc.push({
        subject_no: data.value[8][2],
        semester: semester,
        sy: schoolYear,
        description: data.value[9][2],
        "course": data.value[10][2],
        instructor: data.value[10][6],
        student_id: cur[0],
        student_name: cur[1],
        mtg: cur[2],
        ftg: cur[3],
        final: cur[4],
        remarks: cur[7],
        grade: cur[5]
      })
    }

    return acc;
  }, [])

  students.forEach(async (data) => {
  try {
    const token = sessionStorage.getItem("jwt")
     await axios.post('https://api.nemsu-grading.online/api/grade-masterlists', {data}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    
  } catch (error) {
    console.error(`Failed to create entry: ${error}`);
  }
});
 

  if (!selectedFile.value.name.includes("FRating")) {
    alert("not final rating")
    return
  }
  if (selectedFile.value.length == 0) return
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data.value);
  loading.value = true
  // Get merged cells from the Handsontable instance
  const mergeCells = hotTableRef.value.hotInstance.getSettings().mergeCells || [];
  if (mergeCells.length > 0) {
    ws['!merges'] = mergeCells.map(merge => ({
      s: { r: merge.row, c: merge.col },
      e: { r: merge.row + merge.rowspan - 1, c: merge.col + merge.colspan - 1 },
    }));
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Convert workbook to binary string
  const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  const blob = new Blob([s2ab(excelData)], { type: 'application/octet-stream' });

  // Prepare FormData to send to the server
  const formData = new FormData();
 
  formData.append('files', blob, selectedFile.value.name+"@admin"); // Change filename if needed

  const formData2 = new FormData();
 
 formData2.append('files', blob, selectedFile.value.name+""+extension.value); // Change filename if needed
 
  try {
    try {
      await axios.delete(`https://api.nemsu-grading.online/api/upload/files/${selectedFile.value.id}`)
    } catch (error) {
      // 
    }

    
    
    // Make an API request to Strapi to save the file
    const response = await fetch('https://api.nemsu-grading.online/api/upload/', {
      method: 'POST',
      body: formData,
      // Uncomment if you need to send authorization token
      // headers: { 'Authorization': `Bearer ${token}` },
    });

    await fetch('https://api.nemsu-grading.online/api/upload/', {
      method: 'POST',
      body: formData2,
      // Uncomment if you need to send authorization token
      // headers: { 'Authorization': `Bearer ${token}` },
    });

    await response.json();
    
  } catch (error) {
    console.error('Error saving file:', error);
  } finally { 
    const hotInstance = hotTableRef.value.hotInstance;
    if (hotInstance) {
      hotInstance.loadData([]);
      hotInstance.updateSettings({ cells: hotSettings.value.cells });
      loading.value = false; // Start loading
    }
    selectedFile.value = []
    loading.value = false
    isRenameModalVisible.value =false
    fetchFiles()
  }
};

// Function to convert string to ArrayBuffer
const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
};


    // const cellSettings = (row, col) => {
    //   const cellKey = XLSX.utils.encode_cell({ r: row, c: col });
    //   const cellStyle = data.value[cellKey] || {}; // Use 'data.value' instead of 'dataTable'
 
    //   return {
    //     className: cellStyle.fill ? 'highlight-cell' : '',
    //     style: {
    //       fontFamily: 'Arial',
    //       fontSize: '12px',
    //       border: cellStyle.border ? formatBorders(cellStyle.border) : undefined,
    //     },
    //   };
    // };

    const addFormula = (worksheet, data) => {
      const cellStyles = [];
      worksheet.eachRow((row) => {
        console.log(`Row ${row}:`);
        row.eachCell((cell) => {
            // const cellValue = cell.value;
            console.log(row,cell.col, cell.row) 
            if (cell.formula ) {
              console.log(data[cell.row])
              data[cell.row - 1][cell.col - 1] = `=${cell.formula}`
            } 

            const cellStyle = {
              row: cell.row - 1,
              col: cell.col - 1,
            };

            if (cell.font) {
              cellStyle.fontStyle = {
                color: cell.font.color ? `#${cell.font.color}` : undefined,
                bold: cell.font.bold || false,
                italic: cell.font.italic || false,
              };
            }
            if (cell.fill) {

        console.log("fill",cell.fill)
              // const fillColor = cell.fill.fgColor ? `#${cell.fill.fgColor}` : undefined;
              cellStyle.backgroundColor = cell.fill.bgColor;
            }
            if (cell.alignment) {
              cellStyle.alignment = cell.alignment;
            }
 
            cellStyles.push(cellStyle);
            });
         }); 
         styles.value = cellStyles;
    }

 
  const customCellRenderer = (instance, td, row, col, prop, value, cellProperties) => {
    // Apply cell value
    console.log(instance, prop, cellProperties, value)
    td.innerText = value; 
    // Apply background color
    // console.log(styles.value[row], row, styles.value[row].col, col)
     styles.value.map((style) => {
      if (style.row == row && style.col == col) {
      // console.log("match", styles.value[row])
      if (style.fill && style.fill.fgColor) {
        td.style.backgroundColor = `#${style.fill.fgColor}`;
      }

      // Font styles
      if (style.fontStyle) {
        // console.log("color", style.fontStyle)
        td.style.fontWeight = style.fontStyle.bold ? 'bold' : 'normal';
        td.style.fontStyle = style.fontStyle.italic ? 'italic' : 'normal';
        td.style.color = style.fontStyle.color ? `#${style.fontStyle.color}` : 'black';
        td.style.italic = style.fontStyle.italic;
      }

      // Alignment
      if (style.alignment) {
        td.style.textAlign = style.alignment.horizontal || 'left';
        td.style.verticalAlign = style.alignment.vertical || 'middle';
      }
    }
    return td;
     })
    
  };

    const processMergedCells = (excelData, merges) => {
      const mergedData = excelData.map((row) => { 
        return row.map((cell) => (cell && typeof cell === 'object' ? cell.v : cell))
      }
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

    // const formatBorders = (borders) => {
    //   const borderStyles = Object.entries(borders).map(([key, value]) => {
    //     const borderColor = value.color ? `#${value.color}` : 'black';
    //     const borderWidth = value.sz ? `${value.sz}px` : '1px';
    //     return `${key}: ${borderWidth} solid ${borderColor}`;
    //   });

    //   return borderStyles.join('; ');
    // };

    // Zoom functionality
    const zoomIn = () => {
      zoomLevel.value += 0.1;
      applyZoom();
    };

    const zoomOut = () => {
      zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.1);
      applyZoom();
    };

    const applyZoom = () => {
      const container = hotTableRef.value.$el; // Get the Handsontable element
      container.style.transform = `scale(${zoomLevel.value})`;
      container.style.transformOrigin = 'top left';
      container.style.overflow = "scroll";
      container.style.width = `${100 / (zoomLevel.value)}%`;
      container.style.height = `${700 / zoomLevel.value}px`;
    };

    

    // Fetch files when component is mounted
    fetchFiles();
    fetchSchoolYear();
    return {
      deleteFile,
      hotTableRef,
      data,
      hotSettings,
      files,
      selectedFile,
      loading, 
      exportToExcel,
      isRenameModalVisible,
      newFileName,
      openRenameModal,
      closeRenameModal,
      renameFile,
      onFileChange,
      saveToExcel,
      loadFile,
      zoomIn,
      zoomOut,
      activeSchoolYear,
      submitToAdmin,
      fetchDefaultExcel,
      customCellRenderer
    }; 
  },
});
 
</script>



<style scoped>
.table-container {
  font-size: 12px;
  width: 1500px;
  height: 100%;
  padding: 5px;
  padding-bottom: 50px;
  background-color: #f9f9f9; /* Light background for contrast */
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  overflow: hidden; /* Prevent overflow */
}

.file-select {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%; /* Full width */
  font-size: 12px; /* Font size for better readability */
}

.export-button,
.save-button {
  margin-bottom: 10px;
  padding: 10px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px; /* Consistent font size */
  transition: background-color 0.3s; /* Smooth hover effect */
}

.export-button:hover,
.save-button:hover {
  background-color: #45a049;
}

.zoom-controls {
  margin-bottom: 10px; /* Space between buttons and table */
  position: fixed;
  bottom: 30px; /* Adjusted for better visibility */
  right: 30px;
  z-index: 1000;
}

.zoom-controls button {
  margin-right: 5px; /* Space between zoom buttons */
  padding: 10px;
  background-color: #007BFF; /* Bootstrap primary color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s; /* Smooth hover effect */
}

.zoom-controls button:hover {
  background-color: #0056b3; /* Darker shade on hover */
}

.hot-table {
  transition: transform 0.2s ease; /* Smooth transition for zoom */
  overflow: hidden; /* Allow scrolling for large tables */
  height: 95%;
}

/* Loading Modal Styles */
.loading-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it is on top */
}

.loading-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.spinner {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px; /* Size of the spinner */
  height: 50px; /* Size of the spinner */
  animation: spin 1s linear infinite; /* Spin animation */
  margin-bottom: 10px; /* Space between spinner and text */
}

/* Rename Modal Styles */
.rename-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-file-upload {
  display: inline-block;
  padding: 10px 20px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 10px; /* Add margin for spacing */
  transition: background-color 0.2s ease; /* Smooth transition */
}

.custom-file-upload:hover {
  background-color: #45a049;
}

.custom-file-upload input[type="file"] {
  display: none; /* Hide the default file input */
}

.rename-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.rename-content input {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc; /* Styled input */
  border-radius: 4px; /* Consistent border radius */
  width: calc(100% - 20px); /* Adjust for padding */
}

.file-select-label {
  font-size: 14px; /* Adjust the font size */
  margin-bottom: 5px; /* Space between label and select */
  display: block; /* Make label take the full width */
}

.zoom-controls {
  margin-bottom: 10px;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.zoom-controls button {
  margin-right: 5px;
  padding: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.zoom-controls button svg {
  fill: #007BFF;
  transition: fill 0.3s;
}

.zoom-controls button:hover svg {
  fill: #0056b3;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
