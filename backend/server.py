import requests
import time

# Function to send a request to the website
def send_request(url):
    try:
        response = requests.get(url)
        print(f"Request sent to {url}, Status Code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

# URL of the website you want to send requests to
website_url = "https://amimi-hamza.onrender.com/"

# Loop to send a request every 30 seconds
while True:
    send_request(website_url)
    time.sleep(30)
