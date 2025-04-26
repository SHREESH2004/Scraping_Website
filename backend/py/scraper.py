import requests
from bs4 import BeautifulSoup
import json
import sys

def scrape_website(url):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to retrieve the page: {e}"}

    soup = BeautifulSoup(response.content, 'html.parser')
    result = {
        "title": soup.title.string if soup.title else "No Title",
        "html": soup.prettify(),  # Full HTML content
        "images": []
    }

    images = soup.find_all('img')
    for img in images:
        image_src = img.get('src')
        if image_src:
            if not image_src.startswith("http"):
                image_src = requests.compat.urljoin(url, image_src)
            result["images"].append(image_src)

    return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No URL provided"}))
        sys.exit(1)
    
    target_url = sys.argv[1]
    data = scrape_website(target_url)
    print(json.dumps(data))
