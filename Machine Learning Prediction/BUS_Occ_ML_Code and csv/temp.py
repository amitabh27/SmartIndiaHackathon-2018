#! /usr/bin/python

from flask import Flask, request, jsonify, render_template
from datetime import date
from datetime import time
from datetime import datetime
#import tablib
import os
import csv
import numpy as np
import pandas as pd


app = Flask(__name__)
#dataset = tablib.Dataset()
#with open(os.path.join(os.path.dirname(__file__),'b1_avg_7days.csv')) as f:
#	dataset = f.read()
df=pd.read_csv("b1_avg_7days.csv")

dataset = np.array(df)

@app.route('/busOccupacy', methods=['get'])
def get_BusOccupacy():
    #date = request.args.get('date', None)
    #day = datetime.strptime(date, '%Y-%m-%d').strftime("%A")
    #time_slot = request.args.get('time_slot', None)
    #stop_id = request.args.get('stop_id', None)
    # do something, eg. return json response'


    #return jsonify({'day': day, 'time_slot': time_slot, 'stop_id' : stop_id })
    return dataset[1][3]


if __name__ == '__main__':
    app.run(debug=True)
