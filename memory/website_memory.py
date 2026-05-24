import json
import os

WEBSITE_FILE = "websites.json"


def load_websites():
    if not os.path.exists(WEBSITE_FILE):
        return {}

    try:
        with open(WEBSITE_FILE, "r") as file:
            return json.load(file)
    except json.JSONDecodeError:
        return {}


def save_website(name, url):
    websites = load_websites()
    websites[name.lower().strip()] = url.strip()

    with open(WEBSITE_FILE, "w") as file:
        json.dump(websites, file, indent=4)

    print(f"Saved website: {name} -> {url}")