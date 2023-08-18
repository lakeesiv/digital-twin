import logging
#sys.path.append(os.path.join(pathlib.Path(__file__).parent.absolute(), 'lib/')) #when lib/ is in the parent's folder not at the same level as the script
import lib.iolibs as io
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as md
import datetime

def plot(dataFrame, x=None, y=None, title=None, save=None, show=False):
    plt.clf()
    dataFrame.plot(x=x, y=y, kind='scatter')
    if show:
        plt.show()
    if save:
        plt.savefig("./img/"+save)

def plotXdates(dataFrame, x="acp_ts", y=None, title=None, save=None, show=False):
    plt.clf()
    plt.title(title)
    if(isinstance(dataFrame[x].iloc[0], int) or dataFrame[x].iloc[0], float):
        dt_dates=pd.to_datetime(dataFrame[x], unit='s')
        dates=md.date2num(dt_dates)
        #print(dt_dates)
    else: dates=md.date2num(dataFrame[x])
    values=dataFrame[y]

    plt.subplots_adjust(bottom=0.2)
    plt.xticks( rotation=25 )

    ax=plt.gca()
    xfmt = md.DateFormatter('%Y-%m-%d %H:%M:%S')
    ax.xaxis.set_major_formatter(xfmt)

    plt.plot(dates,values)
    if show:
        plt.show()
    if save:
        plt.savefig("./img/"+save)


def plot_multi(dataFrames, x=[], y=[], title=None, save=None, show=False):
    plt.clf()
    plt.title(title)

    plt.subplots_adjust(bottom=0.2)
    plt.xticks( rotation=25 )

    ax=plt.gca()
    xfmt = md.DateFormatter('%Y-%m-%d %H:%M:%S')
    ax.xaxis.set_major_formatter(xfmt)
    formats=['r-', 'g-o', 'b+', 'y--']
    j=0
    for df in dataFrames:
        #plt.plot(df, formats[j], label=y[j])
        plt.plot(df, label=y[j])
        j+=1
    
    if show:
        plt.show()
    if save:
        plt.savefig("./img/"+save)


        
def plotXdates_multi(dataFrames, x="acp_ts", y=[], title=None, save=None, show=False):
    plt.clf()
    plt.title(title)

    plt.subplots_adjust(bottom=0.2)
    plt.xticks( rotation=25 )

    ax=plt.gca()
    xfmt = md.DateFormatter('%Y-%m-%d %H:%M:%S')
    ax.xaxis.set_major_formatter(xfmt)

    j=0
    formats=['.r', '+g', 'vb', '^y', 'xc', 'dk']
    for df in dataFrames:
        #logging.info(df)
        if(df.empty): continue # go to the next df
        sensor_id=df["acp_id"].iloc[0] if "acp_id" in df else "?"
        if(isinstance(df[x].iloc[0], int) or df[x].iloc[0], float):
            dt_dates=pd.to_datetime(df[x], unit='s')
            dates=md.date2num(dt_dates)
            #print(dt_dates)
        else: dates=md.date2num(df[x])
        for feature in y:
            values=df[feature]
            #plt.plot(dates, values, formats[j], label=feature)
            #plt.plot(dates, values, label=feature)
            plt.scatter(dates, values, label=feature+"_" + sensor_id)
            j+=1
            
    ax.legend(loc='center left', bbox_to_anchor=(1, 0.5))
    if show:
        plt.show()
    if save:
        plt.savefig("./img/"+save, bbox_inches="tight")
