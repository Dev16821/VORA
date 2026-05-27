#this file is entirely for opening applications and websites using terminal commands

import subprocess
from memory.website_memory import save_website

def open_application(app_name):

    #basically this function open any application that installed in linux because this
    #projct is for linux only and it will not work in windows or macos because of the different terminal commands

    try:
        # instead of manual entry of apps, lets the user enters the open application name
        # if app is there it will open otherwise it will show error message
        subprocess.Popen(app_name)
        print(f"{app_name} opened successfully.")
    except FileNotFoundError:
        print(f"Error: {app_name} not found. Please make sure it is installed and try again.")


def open_website(url):
    # this function is for opening websites using terminal commands
    apps_links = {
        "whatsapp" : "https://web.whatsapp.com",
        "digi" : "https://apollouniversity.digiicampus.com/V2/#/home",
        "digicampus" : "https://apollouniversity.digiicampus.com/V2/#/home"
    }
    if url in apps_links:
        url = apps_links[url]
    
    try:
        # using xdg-open command to open the website in default browser
        subprocess.Popen(['xdg-open', url])
        print(f"{url} opened successfully.")
    except Exception as e:
        print(f"Error: Could not open {url}. {e}")
    
    # now lets save the website in memory for future reference
    save_website(url, url)