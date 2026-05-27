from core.command_router import handle_command
from system.memory_cleaner import clean_python_cache
from model.llama import ask_ollama


def is_system_command(command):
    command = command.lower().strip()

    system_prefixes = [
        "open app ",
        "open website ",
        "save website ",
    ]

    return any(command.startswith(prefix) for prefix in system_prefixes)


def main():
    print("VORA is online. Type 'exit' to stop.")

    while True:
        command = input("VORA > ").strip()

        if command.lower() == "exit":
            print("VORA shutting down.")
            break

        if is_system_command(command):
            handle_command(command)
        else:
            response = ask_ollama(command)
            print(f"VORA > {response}")


if __name__ == "__main__":
    clean_python_cache()
    main()