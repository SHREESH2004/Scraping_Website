import requests
from bs4 import BeautifulSoup
import json
import os
from urllib.parse import urljoin
from urllib.request import urlretrieve

def scrape_website(url):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"}
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return {"message": "Failed to retrieve the page"}

    soup = BeautifulSoup(response.content, 'html.parser')

    html_content = soup.prettify()

    if not os.path.exists("images"):
        os.makedirs("images")

    images = []
    for i, img in enumerate(soup.find_all('img')):
        if 'src' in img.attrs:
            img_url = urljoin(url, img['src'])  
            img_name = f"images/image_{i+1}.jpg"  
            img_data = requests.get(img_url)

            # Save the image
            if img_data.status_code == 200:
                with open(img_name, 'wb') as f:
                    f.write(img_data.content)
                images.append(img_name)

                img['src'] = img_name

    with open("scraped_page.html", 'w', encoding="utf-8") as f:
        f.write(str(soup))

    return {
        "htmlContent": str(soup),
        "images": images
    }

if __name__ == "__main__":
    import sys
    url = sys.argv[1]
    data = scrape_website(url)
    print(json.dumps(data))
