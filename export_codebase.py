import os
from datetime import datetime

OUTPUT_FILE = "agentboost_full_source_export.txt"

# Directories to exclude (dependencies, generated builds, caches, IDE configs)
IGNORE_DIRS = {
    "node_modules",
    ".next",           # Next.js build output & cache
    "target",          # Rust / Tauri build artifacts
    "dist",
    "build",
    "out",
    ".idea",           # IDE metadata
    ".vscode",
    ".git",
    ".turbo",
    "coverage",
    "scratch",         # Temporary scratchpad files
}

# File extensions to exclude (binaries, bundles, sourcemaps, images)
IGNORE_EXTENSIONS = {
    # Source maps & build dumps
    ".map", ".chunk.js", ".bundle.js",
    # Images & icons
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".icns", ".svg",
    # Fonts
    ".woff", ".woff2", ".ttf", ".eot",
    # Executables & libraries
    ".exe", ".dll", ".so", ".dylib", ".pdb",
    # Archives
    ".zip", ".tar", ".gz", ".7z",
    # Python & lockfiles
    ".pyc", ".lock",
    # Logs
    ".log"
}

# Specific generated or massive files to skip
IGNORE_FILES = {
    OUTPUT_FILE,
    "package-lock.json",
    "LANDING_SKILLS_DESKTOP_WEB_FILES.txt",
}

# Safety limit: Source code files are rarely larger than 500 KB
MAX_FILE_SIZE_BYTES = 500 * 1024  # 500 KB


def is_binary_file(filepath):
    """Check if file contains raw binary data (null bytes)."""
    try:
        with open(filepath, "rb") as f:
            chunk = f.read(1024)
            if b"\0" in chunk:
                return True
        return False
    except Exception:
        return True


def extract_project():
    root_dir = os.path.abspath(".")
    output_path = os.path.join(root_dir, OUTPUT_FILE)
    
    file_count = 0
    skipped_count = 0

    print(f"Extracting source code from: {root_dir}")
    print("Excluding: node_modules, .next, target, source maps, and binary files...\n")

    with open(output_path, "w", encoding="utf-8") as out:
        out.write("=" * 100 + "\n")
        out.write("AgentBoost Clean Source Export (Excluding Generated Artifacts)\n")
        out.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        out.write("=" * 100 + "\n\n")

        for dirpath, dirnames, filenames in os.walk(root_dir):
            # Prune ignored directories in-place so os.walk doesn't even traverse them
            dirnames[:] = [d for d in dirnames if d.lower() not in IGNORE_DIRS]

            for filename in sorted(filenames):
                # 1. Skip exact file names
                if filename in IGNORE_FILES:
                    continue

                # 2. Skip any .txt file that looks like an export dump
                if filename.endswith(".txt") and ("export" in filename.lower() or "files" in filename.lower()):
                    continue

                # 3. Skip ignored extensions
                _, ext = os.path.splitext(filename)
                if ext.lower() in IGNORE_EXTENSIONS:
                    continue

                full_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(full_path, root_dir).replace("\\", "/")

                # 4. Skip files larger than 500 KB (generated bundles/dumps)
                try:
                    if os.path.getsize(full_path) > MAX_FILE_SIZE_BYTES:
                        print(f"[-] Skipped (exceeds 500KB): {rel_path}")
                        skipped_count += 1
                        continue
                except OSError:
                    continue

                # 5. Skip binary files
                if is_binary_file(full_path):
                    continue

                try:
                    with open(full_path, "r", encoding="utf-8", errors="replace") as infile:
                        content = infile.read()

                    out.write("=" * 100 + "\n")
                    out.write(f"FILE: {rel_path}\n")
                    out.write("=" * 100 + "\n")
                    out.write(content)
                    if not content.endswith("\n"):
                        out.write("\n")
                    out.write("\n")

                    file_count += 1
                    print(f"[+] Included: {rel_path}")

                except Exception as e:
                    print(f"[!] Error reading {rel_path}: {e}")

    output_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"\nCompleted! Extracted {file_count} genuine source files.")
    print(f"Final file size: {output_size_mb:.2f} MB (saved to {OUTPUT_FILE})")


if __name__ == "__main__":
    extract_project()