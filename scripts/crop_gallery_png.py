import sys
from PIL import Image

def crop_and_center(path, pad_frac=0.12, out_size=1000):
    img = Image.open(path).convert("RGBA")
    bbox = img.getbbox()
    if not bbox:
        print(f"{path}: fully transparent, skipping")
        return
    left, top, right, bottom = bbox
    w, h = right - left, bottom - top
    side = max(w, h)
    pad = int(side * pad_frac)
    side += pad * 2
    cx, cy = (left + right) // 2, (top + bottom) // 2

    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    paste_x = side // 2 - (cx - left) - left + left  # placeholder, recomputed below
    # Paste the original image such that (cx, cy) lands at the center of `square`
    offset_x = side // 2 - cx
    offset_y = side // 2 - cy
    square.paste(img, (offset_x, offset_y), img)

    square = square.resize((out_size, out_size), Image.LANCZOS)
    square.save(path)
    print(f"{path}: cropped to {side}x{side} -> resized {out_size}x{out_size}")

if __name__ == "__main__":
    for p in sys.argv[1:]:
        crop_and_center(p)
