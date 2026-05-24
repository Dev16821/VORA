import subprocess
from memory.website_memory import load_websites


def open_website(name_or_url):
    predefined_links = {
        "whatsapp": "https://web.whatsapp.com",
        "digi": "https://apollouniversity.digiicampus.com/V2/#/home",
        "digicampus": "https://apollouniversity.digiicampus.com/V2/#/home",
    }

    saved_websites = load_websites()
    key = name_or_url.lower().strip()

    if key in predefined_links:
        final_url = predefined_links[key]
    elif key in saved_websites:
        final_url = saved_websites[key]
    else:
        final_url = name_or_url.strip()

    try:
        subprocess.Popen(["xdg-open", final_url])
        print(f"Opened website: {final_url}")
    except Exception as e:
        print(f"Failed to open website: {e}")