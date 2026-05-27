import subprocess
#subprocess is module used to run external commands and applications from within a Python script. 
# It allows you to spawn new processes, connect to their input/output/error pipes, and obtain their return codes. In this code, we use subprocess.Popen to open the specified application.


def open_app(app_name):
    apps = {
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