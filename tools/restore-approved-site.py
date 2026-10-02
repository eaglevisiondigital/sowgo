"""One-time, hash-verified recovery of the already-approved public website.

The temporary archive URL lives ONLY in a site-scoped secret build variable.
No website design, operational data, payment routing, or backend is changed.
Remove the bootstrap build command after public/ is committed to GitHub.
"""
from __future__ import annotations
import hashlib
import io
import os
from pathlib import Path, PurePosixPath
import shutil
import sys
import tempfile
from urllib.parse import urlsplit
from urllib.request import urlopen
from zipfile import ZipFile

SITE_ID = "6895fac9-d4bb-413f-a585-889442f212dd"
ARCHIVE_SHA256 = "2173b694a4674a039c465197fe8083edb14be8af02e2cfd7821328302d1355e8"
PREFIX = "SowGo-Netlify-Upload/"
EXPECTED_COUNT = 27
MAX_DOWNLOAD = 2_000_000


def restore(payload: bytes, destination: Path) -> None:
    if hashlib.sha256(payload).hexdigest() != ARCHIVE_SHA256:
        raise ValueError("Approved archive checksum does not match; refusing deployment.")
    with ZipFile(io.BytesIO(payload)) as archive:
        entries = [entry for entry in archive.infolist() if not entry.is_dir()]
        if len(entries) != EXPECTED_COUNT:
            raise ValueError("Approved website file count does not match.")
        with tempfile.TemporaryDirectory(dir=destination.parent) as temp:
            staging = Path(temp) / "public"
            staging.mkdir()
            seen: set[str] = set()
            for entry in entries:
                if not entry.filename.startswith(PREFIX):
                    raise ValueError("Unexpected archive directory.")
                relative = PurePosixPath(entry.filename[len(PREFIX):])
                if relative.is_absolute() or ".." in relative.parts or not relative.parts:
                    raise ValueError("Unsafe archive path.")
                if str(relative) in seen or entry.file_size > 1_000_000:
                    raise ValueError("Duplicate or oversized website file.")
                seen.add(str(relative))
                target = staging.joinpath(*relative.parts)
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(archive.read(entry))
            if not (staging / "index.html").is_file():
                raise ValueError("Approved archive is missing index.html.")
            if destination.exists():
                raise ValueError("Refusing to overwrite an existing public directory.")
            shutil.move(str(staging), str(destination))
    print("Restored all 27 approved website files; archive checksum verified.")


def main() -> int:
    destination = Path.cwd() / "public"
    if destination.is_dir() and (destination / "index.html").is_file():
        print("Repository website exists; no remote restoration needed.")
        return 0
    if os.environ.get("NETLIFY") and os.environ.get("SITE_ID") != SITE_ID:
        raise ValueError("This bootstrap is restricted to the existing SowGo site.")
    source = os.environ.get("SOWGO_APPROVED_ARCHIVE_URL", "")
    parsed = urlsplit(source)
    if (parsed.scheme != "https" or not parsed.hostname or
            not parsed.hostname.endswith(".oaiusercontent.com") or
            parsed.username or parsed.password):
        raise ValueError("A valid temporary approved-archive build variable is required.")
    try:
        with urlopen(source, timeout=45) as response:
            payload = response.read(MAX_DOWNLOAD + 1)
    except Exception:
        raise RuntimeError("Approved archive transfer failed or link expired; URL withheld.") from None
    if len(payload) > MAX_DOWNLOAD:
        raise ValueError("Approved archive exceeds the allowed size.")
    restore(payload, destination)
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
