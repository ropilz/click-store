import { useCallback, useState } from 'react';
import {useDropzone} from 'react-dropzone'
import {read, utils, WorkBook} from 'xlsx';
import { AppBar, Button, Card, CardContent, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ExcelPicker from './ExcelPicker';
import ExcelPreview from './ExcelPreview';

type RowType = {
  CODIGO: string,
  DESCRIPCION: string,
  CATEGORIA: string,
  SUBCATEGORIA: string,
  UNIDAD: string,
  COSTO: number,
  VENTA: number
};

function Main() {
  const navigate = useNavigate();
  const [file, setFile] = useState<WorkBook | null>(null);

    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Import Excel
            </Typography>
            <Button color="inherit" onClick={() => navigate('/logout')}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Toolbar />
        
        {!file
          ? <ExcelPicker onFileSelected={setFile}/>
          : <ExcelPreview workbook={file} />
        }
      </div>
    );
  }
  
  export default Main;
  