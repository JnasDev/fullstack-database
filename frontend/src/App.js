import React, { useState, useEffect } from "react";
import "./App.css";
import DataTable from "react-data-table-component";
import axios from "axios";

const columns = [
   {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "120px",
   },
   {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "120px",
   },
   {
      name: "Image",
      selector: (row) => row.coverimage,
      sortable: true,
      width: "350px",
      cell: (row) => (
         <img src={row.coverimage} width={250} alt={row.name}></img>
      ),
   },
   {
      name: "Detail",
      selector: (row) => row.detail,
      sortable: true,
      width: "1040px",
   },
   {
      name: "Latitude",
      selector: (row) => row.latitude,
      sortable: true,
      width: "120px",
   },
   {
      name: "Longitude",
      selector: (row) => row.longitude,
      sortable: true,
      width: "120px",
   },
];

function App() {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [totalRows, setTotalRows] = useState(0);
   const [perPage, setPerPage] = useState(10);
   const [page, setPage] = useState(1);
   const [sortColumn, setSortColumn] = useState("");
   const [sortColumnDir, setSortColumnDir] = useState("");
   const [search, setSearch] = useState("");

   const fetchData = async () => {
      setLoading(true);

      let url = `http://localhost:4000/api/attractions?page=${page}&per_page=${perPage}`;
      if (search) {
         url += `&search=${search}`;
      }

      if (sortColumn) {
         url += `&sort_column=${sortColumn}&sort_direction=${sortColumnDir}`;
      }
      const response = await axios.get(url);

      setData(response.data.data);
      setTotalRows(response.data.total);
      setLoading(false);
   };

   const handlePageChange = (page) => {
      setPage(page);
   };

   const handlePerRowsChange = async (newPerPage, page) => {
      setPerPage(newPerPage);
   };

   const handleSort = (column, sortDirection) => {
      setSortColumn(column.name);
      setSortColumnDir(sortDirection);
   };

   const handleSearchChange = (e) => {
      setSearch(e.target.value);
   };

   const onSearchSubmit = (e) => {
      e.preventDefault();
      fetchData();
   };

   useEffect(() => {
      fetchData(0); // fetch page 1 of users
   }, [page, perPage, sortColumn, sortColumnDir]);

   return (
      <>
         <form onSubmit={onSearchSubmit}>
            <label>
               Search:
               <input type="text" name="search" onChange={handleSearchChange} />
            </label>
            <input type="submit" value="Submit" />
         </form>

         <DataTable
            title="Attractions"
            columns={columns}
            data={data}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            onSort={handleSort}
         />
      </>
   );
}

export default App;
