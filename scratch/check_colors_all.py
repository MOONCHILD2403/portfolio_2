import os
from PIL import Image

def analyze_rgb(path):
    if not os.path.exists(path):
        return
    img = Image.open(path).convert('RGBA')
    w, h = img.size
    pixels = img.load()
    
    # Calculate average RGB of non-transparent pixels
    total_r = 0
    total_g = 0
    total_b = 0
    count = 0
    
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a > 0:
                total_r += r
                total_g += g
                total_b += b
                count += 1
                
    if count == 0:
        print(f"{path} is completely empty/transparent")
        return
        
    avg_r = total_r / count
    avg_g = total_g / count
    avg_b = total_b / count
    print(f"{path} average: ({avg_r:.1f}, {avg_g:.1f}, {avg_b:.1f}), format: {img.format}, size: {img.size}")

folder = "C:\\Users\\hp\\.gemini\\antigravity\\brain\\dcd6b834-904f-402b-bb54-e4e264259762"
for f in os.listdir(folder):
    if f.startswith("media__") and f.endswith(".png"):
        analyze_rgb(os.path.join(folder, f))
