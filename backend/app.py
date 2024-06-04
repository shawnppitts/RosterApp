from flask import Flask
import os
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS, cross_origin
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
client = OpenAI(
    organization=os.getenv('OPENAI_ORG'),
    api_key=os.getenv('OPENAI_KEY')
)

@app.route("/")
def hello_world():
    return "<h1>Hello, World!</h1>"

@app.route("/roster/<team>")
def get_roster(team):
    url = f"https://www.mlb.com/{team}/roster/40-man"
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        fourty_man_roster = soup.find('div', 'players').find_all('table', 'roster__table')
        team_roster = []
        for roster in fourty_man_roster:
            players = roster.find('tbody').find_all('tr')
            for player in players:
                found_player = player.find('td','info').find('a')
                team_roster.append(found_player.string)
        return team_roster
    
@app.route("/player/<player>/stats")
def get_description(player):
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a MLB statistical analyst who only provides stats in 5 sentences and only from this year of 2023."},
            {"role": "user", "content": f"Tell me about MLB player {player} stats from 2023"}
        ]
    )
    response = completion.choices[0].message
    return response.content