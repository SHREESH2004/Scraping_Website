import requests
from bs4 import BeautifulSoup
import random
import time

def scrape_website_dynamic(url):
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.198 Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/115.0.1901.188",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5672.126 Safari/537.36",
        "Mozilla/5.0 (iPad; CPU OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1",
        ]

    def get_random_user_agent():
        return random.choice(user_agents)

    headers = {"User-Agent": get_random_user_agent()}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        all_links = soup.find_all("a", href=True)
        products = []

        for link in all_links:
            title = link.get_text(strip=True)
            href = link['href']

            if len(title) > 10 and 'product' in href:
                products.append((title, href))

        if not products:
            print("No products found dynamically.")
            return

        print(f"Found {len(products)} products dynamically:\n")
        for index, (title, href) in enumerate(products[:10]):  
            full_url = "https://amazon.in" + href if href.startswith("/") else href
            print(f"Product {index + 1}: {title}")
            print(f"URL: {full_url}\n")
            time.sleep(2)  

    except requests.exceptions.RequestException as e:
        print("Error with the request:", e)
url = input("Enter Amazon Search URL: ")
scrape_website_dynamic(url)
