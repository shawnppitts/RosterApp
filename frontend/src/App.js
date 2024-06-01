import logo from './logo.svg';
import 'semantic-ui-css/semantic.min.css'
import React, { useState } from 'react'
import { 
  Dropdown, 
  Button,   
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table, 
} from 'semantic-ui-react'
import './App.css';
import axios from 'axios'

// MLB Teams
const teams = [
  {text:'Boston Red Sox', value:'redsox'},
  {text:'New York Yankees', value:'yankees'}
]

function App() {
  const [team, setTeam] = useState(0)
  const [roster, setRoster] = useState(0)
  const [error, setError] = useState(0)

  const handleChange = (event, data) => {
    setTeam(data.value)
  }

  const fetchRoster = async () => {
    if (team !== 0){
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const url = `http://${backendUrl}:8080/roster/${team}`
        console.log(backendUrl)
        console.log(url)
        const response = await axios.get(url);
        setRoster(response);
      } catch (error) {
        setError(error);
      }
    }
  }

  return (
    <div className="App">
      <h1>MLB Roster</h1>
      <Dropdown
        placeholder='Select Team'
        fluid
        selection
        options={teams}
        onChange={handleChange}
      />
      <Button onClick={fetchRoster}>Get Roster</Button>
      <div>
      {roster ? (
        <div>
          <Table celled inverted selectable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableRow>
            </TableHeader>

            <TableBody>
                {roster["data"].map((item, index) => (
                  <TableRow>
                    <TableCell key={index}>{item}</TableCell>
                  </TableRow>
                ))}                
            </TableBody>
          </Table>       
        </div>
      ) : error ? (
        <div>
          <h1>Error:</h1>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
    </div>
  )
}

export default App;
