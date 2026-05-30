from PIL import Image

def analyze_rgb(path):
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
    print(f"{path} average color of visible pixels: ({avg_r:.1f}, {avg_g:.1f}, {avg_b:.1f})")

analyze_rgb('public/yb-logo-light.png')
analyze_rgb('public/yb-logo-dark.png')
