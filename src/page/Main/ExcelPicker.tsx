import { useCallback } from 'react';
import {useDropzone} from 'react-dropzone'
import {read, WorkBook} from 'xlsx';
import { Card, CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function ExcelPicker({onFileSelected}: {onFileSelected: (file: WorkBook) => void}) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const buffer = await acceptedFiles[0].arrayBuffer();
      const workbook = read(buffer, {type: 'buffer'});
      onFileSelected(workbook);
      // workbook.SheetNames.forEach(sheetName => {
      //   const worksheet = workbook.Sheets[sheetName];
      //   const json: RowType[] = utils.sheet_to_json(worksheet);
      //   const categories = new Set<string>();
      //   for (const row of json) {
      //     categories.add(row.CATEGORIA);
      //     if (row.CATEGORIA === "Descuento ofertas") {
      //       console.log(row);
      //     }
      //   }
      //   console.log(categories);
      // });
    }
  }, [])


//   xls	application/vnd.ms-excel
// xlsm	application/vnd.ms-excel.sheet.macroEnabled.12
  const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '.xls'],
      'application/vnd.ms-excel.sheet.binary.macroEnabled.12': ['.xlsb'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.ms-excel.sheet.macroEnabled.12': ['.xlsm'],
    },
    onDrop
  });
    return (
      <div>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '2rem',
        }}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
                <Card
                  elevation={isDragActive ? 5 : 1}
                  sx={{
                    width: 200,
                    height: 200,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}>
                  <CardContent>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                      Cargar Excel
                    </Typography>
                    <FileUploadIcon />
                  </CardContent>
                </Card>
            </div>
          </Box>
      </div>
    );
  }
  
  export default ExcelPicker;
  