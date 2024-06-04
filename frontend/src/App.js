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
  MenuMenu,
  MenuItem, 
  Menu
} from 'semantic-ui-react'
import './App.css';
import axios from 'axios'

// MLB Teams
const teams = [
    {text: 'Arizona Diamondbacks', value: 'dbacks'},
    {text: "Atlanta Braves", value: "braves"},
    {text: "Baltimore Orioles", value: "orioles"},
    {text: "Boston Red Sox", value: "redsox"},
    {text: "Chicago White Sox", value: "whitesox"},
    {text: "Chicago Cubs", value: "cubs"},
    {text: "Cincinnati Reds", value: "reds"},
    {text: "Cleveland Guardians", value: "guardians"},
    {text: "Colorado Rockies", value: "rockies"},
    {text: "Detroit Tigers", value: "tigers"},
    {text: "Houston Astros", value: "astros"},
    {text: "Kansas City Royals", value: "royals"},
    {text: "Los Angeles Angels", value: "angels"},
    {text: "Los Angeles Dodgers", value: "dodgers"},
    {text: "Miami Marlins", value: "marlins"},
    {text: "Milwaukee Brewers", value: "brewers"},
    {text: "Minnesota Twins", value: "twins"},
    {text: "New York Yankees", value: "yankees"},
    {text: "New York Mets", value: "mets"},
    {text: "Oakland Athletics", value: "athletics"},
    {text: "Philadelphia Phillies", value: "phillies"},
    {text: "Pittsburgh Pirates", value: "pirates"},
    {text: "San Diego Padres", value: "padres"},
    {text: "San Francisco Giants", value: "giants"},
    {text: "Seattle Mariners", value: "mariners"},
    {text: "St. Louis Cardinals", value: "cardinals"},
    {text: "Tampa Bay Rays", value: "rays"},
    {text: "Texas Rangers", value: "rangers"},
    {text: "Toronto Blue Jays", value: "bluejays"},
    {text: "Washington Nationals", value: "nationals"}
]

function App() {
  const [team, setTeam] = useState(0)
  const [roster, setRoster] = useState(0)
  const [error, setError] = useState(0)
  const [stats, setStats] = useState({})

  const handleChange = (event, data) => {
    setTeam(data.value)
  }

  const fetchRoster = async () => {
    if (team !== 0){
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const url = `http://${backendUrl}:8080/roster/${team}`
        console.log(url)
        const response = await axios.get(url);
        setRoster(response);
      } catch (error) {
        setError(error);
      }
    }
  }

  const fetchPlayerStats = async (item, index) => {
    const player = index.value;
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const url = `http://${backendUrl}:8080/player/${player}/stats`
      const response = await axios.get(url);
      console.log(response["data"])
      setStats((prevStats) => ({
        ...prevStats,
        [player]: response,
      }));
    } catch (error) {
      setError(error)
    }
  }

  return (
    <div className="App">
      <Menu secondary>
        <MenuItem>
          <h1>MLB Rosters</h1>
        </MenuItem>
        <MenuMenu position="center">
          <MenuItem>
            <Dropdown
            placeholder='Select Team'        
            selection
            options={teams}
            className="dropdown"
            onChange={handleChange}
            />
            <Button id="roster-btn" onClick={fetchRoster}>Get Roster</Button>
          </MenuItem>
        </MenuMenu>
      </Menu>
      <div>
      {roster ? (
        <div className="table">
          <Table celled inverted selectable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell id="header">Player Name</TableHeaderCell>
                <TableHeaderCell id="header">Fetch</TableHeaderCell>
                <TableHeaderCell id="header">Player Stats</TableHeaderCell>
              </TableRow>
            </TableHeader>

            <TableBody id="table-body">
                {roster["data"].map((item, index) => (
                  <TableRow id="table-row">
                    <TableCell className="tcell" key={index}>{item}</TableCell>
                    <TableCell className="tcell" id="fetch-cell"><Button id="fetch-btn" onClick={fetchPlayerStats} value={item}>Fetch Stats</Button></TableCell>
                    <TableCell className="tcell" id="stats-cell">{stats[item] ? <p>{stats[item]["data"]}</p> : 'No stats generated'}</TableCell>
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
        <h3 id="loading">Loading...</h3>
      )}
    </div>
    </div>
  )
}

export default App;
