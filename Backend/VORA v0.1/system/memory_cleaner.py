"""
VORA - Cache Cleaner
Cleans __pycache__ directories and compiled Python files.

This utility removes:
- __pycache__ folders
- .pyc files
- .pyo files

Safe Python-based version.
"""

import os
import shutil


def clean_python_cache(start_path="."):
    """
    Delete all __pycache__ directories and .pyc/.pyo files recursively.

    Args:
        start_path (str): Directory path from where cleaning should start.
                          Default is current directory.
    """

    pycache_count = 0
    compiled_file_count = 0

    if not os.path.exists(start_path):
        print(f"Error: Path does not exist: {start_path}")
        return

    for root, dirs, files in os.walk(start_path):
        # Copy dirs list because we may modify it while iterating
        for dir_name in dirs[:]:
            if dir_name == "__pycache__":
                dir_path = os.path.join(root, dir_name)

                try:
                    shutil.rmtree(dir_path)
                    dirs.remove(dir_name)  # Prevent os.walk from entering deleted folder
                    print(f"Deleted directory: {dir_path}")
                    pycache_count += 1

                except PermissionError:
                    print(f"Permission denied: {dir_path}")

                except Exception as error:
                    print(f"Failed to delete directory {dir_path}: {error}")

        for file_name in files:
            if file_name.endswith((".pyc", ".pyo")):
                file_path = os.path.join(root, file_name)

                try:
                    os.remove(file_path)
                    print(f"Deleted file: {file_path}")
                    compiled_file_count += 1

                except PermissionError:
                    print(f"Permission denied: {file_path}")

                except Exception as error:
                    print(f"Failed to delete file {file_path}: {error}")

    print("\nCache cleaning completed.")
    print(f"Removed {pycache_count} __pycache__ directories.")
    print(f"Removed {compiled_file_count} compiled Python files.")


if __name__ == "__main__":
    clean_python_cache()