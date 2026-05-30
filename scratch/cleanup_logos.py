from PIL import Image

def cleanup_alpha(path):
    img = Image.open(path).convert('RGBA')
    w, h = img.size
    pixels = img.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 10: # If almost fully transparent
                pixels[x, y] = (0, 0, 0, 0)
    img.save(path, 'PNG')
    print(f"Cleaned up {path}")

cleanup_alpha('public/yb-logo-light.png')
cleanup_alpha('public/yb-logo-dark.png')
