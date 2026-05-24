import subprocess


def open_app(app_name):
    apps = {
        "chrome": "google-chrome",
        "brave": "brave-browser",
        "vscode": "code",
        "files": "nautilus",
        "terminal": "gnome-terminal",
    }

    key = app_name.lower().strip()

    if key in apps:
        command = apps[key]
    else:
        command = key

    try:
        subprocess.Popen([command])
        print(f"Opened app: {app_name}")
    except Exception as e:
        print(f"Failed to open app: {app_name}. Error: {e}")