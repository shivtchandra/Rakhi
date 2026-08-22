import sys, json, base64, re

def main(result_path, out_path):
    raw = open(result_path).read()
    try:
        data = json.loads(raw)
        text = data[0]["text"]
    except (json.JSONDecodeError, KeyError, IndexError):
        text = raw
    m = re.search(r"data:image/png;base64,([A-Za-z0-9+/=]+)", text)
    if not m:
        print(f"{result_path}: no base64 PNG found")
        sys.exit(1)
    b64 = m.group(1)
    with open(out_path, "wb") as f:
        f.write(base64.b64decode(b64))
    print(f"{out_path}: wrote {len(b64)} base64 chars")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
