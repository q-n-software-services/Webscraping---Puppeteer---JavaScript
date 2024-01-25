import pandas as pd
import requests
import stem
from bs4 import BeautifulSoup

# def get_tor_session():
#     session = requests.session()
#     # Tor uses the 9050 port as the default socks port
#     session.proxies = {'http': 'socks5://127.0.0.1:9050',
#                        'https': 'socks5://127.0.0.1:9050'}
#     return session
#
# # Make a request through the Tor connection
# # IP visible through TOR
# session = get_tor_session()
# print(session.get('http://httpbin.org/ip').text)
# # Above should print your IP different than your public IP
#
# '''page = session.get('https://w2.leisurelink.lcsd.gov.hk/leisurelink/index/index.jsp?lang=en')
# soup = BeautifulSoup(page.content, 'html.parser')
# print(soup)'''
# # Following prints your normal public IP
# print(requests.get('http://httpbin.org/ip').text)
#
#
# from stem import Signal
# from stem.control import Controller
#
# # Signal TOR for a new connection
# def renew_connection():
#     with Controller.from_port(port=9051) as controller:
#         controller.authenticate(password='mohib122')
#         controller.signal(Signal.NEWNYM)
#
# renew_connection()
# session = get_tor_session()
# print(session.get('http://httpbin.org/ip').text)
#

url = 'https://www.gsmarena.com/samsung_galaxy_f13-11624.php'

# from selenium import webdriver
# from selenium.webdriver.common.by import By
#
# driver = webdriver.Chrome()
#
# driver.get(url)
#
# a = driver.find_elements(By.CLASS_NAME, 'specs-phone-name-title')
#
# print(a[0])

from bs4 import BeautifulSoup
import requests


def do():
    # renew_connection()
    # session = get_tor_session()
    # print(session.get('http://httpbin.org/ip').text)

    page = requests.get(url)

    soup = BeautifulSoup(page.content, 'html.parser')
    # print(soup)
    a = soup.find_all('h1')
    name = str(a[0])
    name = name.split('>')[1].split('<')[0]
    print(name)

    ac = soup.find("div", {"id": "specs-list"})
    # print(ac)

    cc = ac.find_all('th')
    cc = [str(name).split('>')[1].split('<')[0] for name in cc]
    # print(cc[2])
    # print()
    # print()
    # print(cc)
    # print(len(cc))

    myData = {'Name': name}
    for heading in cc:
        myData[heading] = {}

    #print(myData)
    new = []
    for i, row in enumerate(ac):
        #print(i + 1, row)
        if 'table' in str(row):
            new.append(row)
    #print(new)
    #print(len(new))

    myData['Network'] = new[0]
    myData['Launch'] = new[1]
    myData['Body'] = new[2]
    myData['Display'] = new[3]
    myData['Platform'] = new[4]
    myData['Memory'] = new[5]
    myData['Main Camera'] = new[6]
    myData['Selfie camera'] = new[7]
    myData['Sound'] = new[8]
    myData['Comms'] = new[9]
    myData['Features'] = new[10]
    myData['Battery'] = new[11]
    myData['Misc'] = new[12]

    return myData


# print(do())
data = do()

for key in data:
    print()
    print()
    temp = ''
    # print(key)
    # temp += str(key) + '\n'
    if key != 'Name':
        my = data[key].findAll('td')
        for i in my:
            temp += str(i).split('>')[1].split('<')[0] + '  '

        data[key] = temp

for key in data:
    print(key)
    print()
    print(data[key])
    print()
    print()

print('\n\n\n\n\n')
print('The data Frame Starts from here')
print(data)
print(type(data))
print(len(data))
print('\n\n\n\n\n')

# myframe = pd.DataFrame.from_dict(data, index=[0])
#
# myframe = myframe.T
#
# print(myframe.describe())

df = pd.DataFrame(data, index=[0])
# df = df.T
print(df)
df.to_csv('Example2.csv')
