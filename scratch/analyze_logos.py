import os
from PIL import Image

def analyze_image(path):
    if not os.path.exists(path):
        print(f"File {path} does not exist")
        return
    img = Image.open(path)
    print(f"\nAnalyzing {path}:")
    print(f"Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
    
    # Get distinct colors or check transparency
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        print("Image has transparency channel")
    else:
        print("Image has NO transparency channel")
        
    # Sample some pixels from the corners (usually background)
    w, h = img.size
    pixels = img.convert('RGBA')
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

os.makedirs('scratch', exist_ok=True)
analyze_image('public/yb-logo-light.png')
analyze_image('public/yb-logo-dark.png')
