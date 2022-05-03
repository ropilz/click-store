import {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { utils, WorkBook } from 'xlsx';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';


type RowType = {
    CODIGO: string,
    DESCRIPCION: string,
    TALLA: string,
    COLOR: string,
    ML: string,
    UNIDAD: string,
    COSTO: number,
    VENTA: number
    CATEGORIA: string,
    SUBCATEGORIA: string,
    SALDO: number
};


interface Column {
  id: keyof RowType;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'CODIGO', label: 'Código', minWidth: 100 },
  { id: 'DESCRIPCION', label: 'Descripción', minWidth: 300 },
  { id: 'TALLA', label: 'Talla', minWidth: 80 },
  { id: 'COLOR', label: 'Color', minWidth: 80 },
  { id: 'CATEGORIA', label: 'Categoría', minWidth: 100 },
  { id: 'SUBCATEGORIA', label: 'Subcategoría', minWidth: 100 },
  { id: 'ML', label: 'ML', minWidth: 20 },
  { id: 'COSTO', label: 'Costo', minWidth: 60, align: 'right', format: (value: number) => `${value.toFixed(2)} Bs.` },
  { id: 'VENTA', label: 'Venta', minWidth: 60, align: 'right', format: (value: number) => `${value.toFixed(2)} Bs.` },
  { id: 'SALDO', label: 'Saldo', minWidth: 60, align: 'right', format: (value: number) => value.toLocaleString('en-US') },
];


export default function ExcelPreview({workbook}: {workbook: WorkBook}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [categories, setCategories] = useState<string[]>([]);
  const [talla, setTalla] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<{[key:string]: string[]}>({'Todas': []});
  const [rows, setRows] = useState<RowType[]>([]);
  const [filteredRows, setFilteredRows] = useState<RowType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todas');
  const [selectedTalla, setSelectedTalla] = useState<string>('Todas');
  const [selectedColor, setSelectedColor] = useState<string>('Todas');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    let rows = [] as RowType[];
    const categories = new Set<string>();
    const talla = new Set<string>();
    const color = new Set<string>();
    const subcategories: {[key: string]: Set<string>} = {['Todas']: new Set<string>()};
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      rows = utils.sheet_to_json(worksheet);
      for (const row of rows) {
        categories.add(row.CATEGORIA);
        talla.add(row.TALLA);
        color.add(row.COLOR);
        if (!subcategories[row.CATEGORIA]) {
          subcategories[row.CATEGORIA] = new Set<string>();
        }
        subcategories[row.CATEGORIA].add(row.SUBCATEGORIA);

      }
    });
    const categoriesArray = Array.from(categories);
    const subcategoriesArray: {[key:string]: string[]} = {'Todas': Array.from(subcategories['Todas'])};
    setCategories(categoriesArray);
    setTalla(Array.from(talla));
    setColor(Array.from(color));
    setSubcategories({'Todas': Array.from(subcategories['Todas'])});
    for (const category of categoriesArray) {
      subcategoriesArray[category] = Array.from(subcategories[category]);
    }
    setRows(rows);
    setSubcategories(subcategoriesArray);
  }, [workbook]);

  useEffect(() => {
    let filteredRows: RowType[] = rows;
    if (selectedTalla !== 'Todas') { filteredRows = filteredRows.filter(row => row.TALLA === selectedTalla ); }
    if (selectedColor !== 'Todas') { filteredRows = filteredRows.filter(row => row.COLOR === selectedColor ); }

    filteredRows = filteredRows.filter(row => {
      if (selectedCategory === 'Todas') {
        return true;
      }
      if (selectedSubcategory === 'Todas') {
        return row.CATEGORIA === selectedCategory;
      } else {
        return row.CATEGORIA === selectedCategory && row.SUBCATEGORIA === selectedSubcategory;
      }
    });
    setFilteredRows(filteredRows);
  }, [selectedCategory, selectedSubcategory, rows, selectedTalla, selectedColor]);



  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ width: '100%', height: '100px', padding: '8px'}}>

      <FormControl sx={{width: '300px'}}>
        <InputLabel id="category">Categoría</InputLabel>
        <Select
          labelId="category"
          id="select-category"
          value={selectedCategory}
          label={selectedCategory}
          onChange={(event: SelectChangeEvent) => {
            setSelectedCategory(event.target.value as string);
            setSelectedSubcategory('Todas');
          }}
        >
          <MenuItem value="Todas" key="Todas">Todas</MenuItem>
          {categories.map(category => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{width: '300px'}}>
        <InputLabel id="subcategory">Subcategoría</InputLabel>
        <Select
          labelId="subcategory"
          id="select-subcategory"
          value={selectedSubcategory}
          label={selectedSubcategory}
          onChange={(event: SelectChangeEvent) => setSelectedSubcategory(event.target.value as string)}
        >
          <MenuItem value="Todas" key="Todas">Todas</MenuItem>
          {subcategories[selectedCategory].map(subcategory => (
            <MenuItem key={subcategory} value={subcategory}>{subcategory}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl sx={{width: '300px'}}>
        <InputLabel id="talla">Talla</InputLabel>
        <Select

          labelId="talla"
          id="select-talla"
          value={selectedTalla}
          label={selectedTalla}
          onChange={(event: SelectChangeEvent) => setSelectedTalla(event.target.value as string)}
        >
          <MenuItem value="Todas" key="Todas">Todas</MenuItem>
          {talla.map(t => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{width: '300px'}}>
        <InputLabel id="color">Color</InputLabel>
        <Select
          labelId="color"
          id="select-color"
          value={selectedColor}
          label={selectedColor}
          onChange={(event: SelectChangeEvent) => setSelectedColor(event.target.value as string)}
        >
          <MenuItem value="Todas" key="Todas">Todas</MenuItem>
          {color.map(color => (
            <MenuItem key={color} value={color}>{color}</MenuItem>
          ))}
        </Select>
      </FormControl>

      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.CODIGO}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100, 10000]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
