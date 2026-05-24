from core.command_router import handle_command
from system.memory_cleaner import clean_python_cache
from model.llama import ask_ollama


def main():
    print("VORA is online. Type 'exit' to stop.")

    while True:
        command = input("VORA > ")

        print(f"VORA > {ask_ollama(command)}")  # Print Ollama's response

        if command.lower().strip() == "exit":
            print("VORA shutting down.")
            break

        #handle_command(command)


if __name__ == "__main__":
    clean_python_cache()
    main()
