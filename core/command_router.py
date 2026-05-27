from system.app_open import open_app
from system.website_open import open_website
from memory.website_memory import save_website

# Command router to handle user commands
# This function takes a command string, parses it, and executes the appropriate action.


def handle_command(command):
    command = command.lower().strip()

    # 
    if command.startswith("open app "):
        app_name = command.replace("open app ", "", 1)
        open_app(app_name)

    elif command.startswith("open website "):
        website = command.replace("open website ", "", 1)
        open_website(website)

    elif command.startswith("save website "):
        parts = command.replace("save website ", "", 1).split()

        if len(parts) < 2:
            print("Usage: save website <name> <url>")
            return

        name = parts[0]
        url = parts[1]
        save_website(name, url)

    else:
        print("Command not recognized.")