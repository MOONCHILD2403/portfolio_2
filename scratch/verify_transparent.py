import os
from PIL import Image

def verify_transparency(path):
    if not os.path.exists(path):
        print(f"File {path} does not exist")
        return
    img = Image.open(path)
    print(f"\nVerifying {path}:")
    print(f"Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
    
    pixels = img.convert('RGBA')
    w, h = img.size
    corners = [
        pixels.getpixel((0, 0)),
        pixels.getpixel((w - 1, 0)),
        pixels.getpixel((0, h - 1)),
        pixels.getpixel((w - 1, h - 1)),
        pixels.getpixel((w // 2, 20)),
    ]
    print("Sample pixels (corners/edges):")
    for c in corners:
        print(c)
        if c[3] != 0:
            print("WARNING: corner pixel is NOT fully transparent!")

verify_transparency('public/yb-logo-light.png')
verify_transparency('public/yb-logo-dark.png')
