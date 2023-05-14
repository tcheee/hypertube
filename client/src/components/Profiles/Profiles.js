import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const columns = [
  { field: 'firstname', headerName: 'First Name', width: 150 },
  { field: 'lastname', headerName: 'Last Name', width: 150 },
  { field: 'username', headerName: 'User Name', width: 150 },
  { field: 'language', headerName: 'Language', width: 150 },
];

function Profiles() {
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [rows, setRows] = useState();

  useEffect(() => {
    axios.get('/api/users').then((res) => {
      setRows(res.data.users);
      setLoading(false);
    });
  }, []);

  const onRowClicked = (event) => {
    history.push('profile/' + event.row.uuid);
  };
  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div style={{ height: 400, width: '100%', backgroundColor: '#F93333' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={onRowClicked}
      />
    </div>
  );
}

export default Profiles;
