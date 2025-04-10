import os

# Ścieżka do głównego folderu projektu.
# Wstaw tutaj ścieżkę do folderu "pomoc-sasiedzka", np.:
# project_root = r"C:\Users\TwojaNazwaUzytkownika\pomoc-sasiedzka"
project_root = (
    r"C:\Users\barte\OneDrive\Pulpit\Studia\ROK III\Semestr 2\pomoc-sasiedzka"
)

# Plik wynikowy, do którego zapiszesz treści plików
output_file = "zebrane_pliki.txt"

# Rozszerzenia uznane za "istotne" w tym przykładzie
valid_extensions = {
    ".js",
    ".css",
    ".html",
    ".py",
    ".java",
    ".md",
    ".txt",
    ".json",
    ".yaml",
    ".yml",
}


def is_text_file(file_path):
    """
    Funkcja sprawdza, czy plik ma rozszerzenie
    wskazujące na pliki tekstowe/kod źródłowy.
    W razie potrzeby można to rozszerzyć
    o dodatkową logikę (np. MIME type).
    """
    _, ext = os.path.splitext(file_path)
    return ext.lower() in valid_extensions


def collect_files_and_save(root_folder, output_txt):
    with open(output_txt, "w", encoding="utf-8") as out_file:
        for dirpath, dirnames, filenames in os.walk(root_folder):
            for filename in filenames:
                file_path = os.path.join(dirpath, filename)

                # Sprawdzamy, czy plik jest tekstowy (na podstawie rozszerzenia)
                if is_text_file(file_path):
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read()
                    except UnicodeDecodeError:
                        # Jeśli plik jednak nie jest w formacie tekstowym, pomijamy
                        continue

                    # Możemy zapisać np. ścieżkę pliku i jego zawartość
                    out_file.write(f"========================================\n")
                    out_file.write(f"PLIK: {file_path}\n")
                    out_file.write("========================================\n")
                    out_file.write(content + "\n\n")


if __name__ == "__main__":
    collect_files_and_save(project_root, output_file)
    print(f"Zebrano pliki w: {output_file}")
