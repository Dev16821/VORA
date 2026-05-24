from core.command_router import handle_command


def main():
    print("VORA is online. Type 'exit' to stop.")

    while True:
        command = input("VORA > ")

        if command.lower().strip() == "exit":
            print("VORA shutting down.")
            break

        handle_command(command)


if __name__ == "__main__":
    main()