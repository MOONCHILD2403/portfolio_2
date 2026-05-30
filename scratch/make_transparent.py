import os
from PIL import Image

def process_logo_light(input_path, output_path):
    print(f"Processing light logo: {input_path}")
    img = Image.open(input_path).convert('RGBA')
    w, h = img.size
    pixels = img.load()
    
    # In light logo, monogram is dark black script, background is grey/white checkerboard.
    # We can use simple thresholding because the monogram is very dark.
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # If the pixel is bright (part of checkerboard background), make it transparent
            if r > 110 and g > 110 and b > 110:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                # Keep the dark monogram, maybe smooth it out a bit
                # We can keep it exactly as is
                pass
                
    img.save(output_path, 'PNG')
    print(f"Saved transparent light logo to {output_path}")

def process_logo_dark_floodfill(input_path, output_path):
    print(f"Processing dark logo (flood fill): {input_path}")
    img = Image.open(input_path).convert('RGBA')
    w, h = img.size
    pixels = img.load()
    
    # We will run a flood fill (BFS) starting from the four corners and edges
    # to identify and mask out the checkerboard background.
    visited = [[False for _ in range(h)] for _ in range(w)]
    queue = []
    
    # Seed corners and edges
    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
        visited[x][0] = True
        visited[x][h - 1] = True
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))
        visited[0][y] = True
        visited[w - 1][y] = True
        
    # BFS
    while queue:
        x, y = queue.pop(0)
        r, g, b, a = pixels[x, y]
        
        # Check if this pixel is part of the background (white or light grey)
        # Background pixels in yb-logo-dark.png are very bright (R, G, B > 215)
        # Let's check if the pixel matches background criteria
        is_bg = (r > 215 and g > 215 and b > 215) or \
                (abs(r - g) < 5 and abs(g - b) < 5 and r > 150) # Catch any other grey grids
                
        if is_bg:
            # Set to fully transparent
            pixels[x, y] = (0, 0, 0, 0)
            
            # Add neighbors
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h:
                    if not visited[nx][ny]:
                        visited[nx][ny] = True
                        queue.append((nx, ny))
                        
    # Save the output
    img.save(output_path, 'PNG')
    print(f"Saved transparent dark logo to {output_path}")

os.makedirs('scratch', exist_ok=True)
# Let's save a backup of the original logos first just in case!
if not os.path.exists('public/yb-logo-light-orig.png'):
    os.rename('public/yb-logo-light.png', 'public/yb-logo-light-orig.png')
if not os.path.exists('public/yb-logo-dark-orig.png'):
    os.rename('public/yb-logo-dark.png', 'public/yb-logo-dark-orig.png')

process_logo_light('public/yb-logo-light-orig.png', 'public/yb-logo-light.png')
process_logo_dark_floodfill('public/yb-logo-dark-orig.png', 'public/yb-logo-dark.png')
print("Completed transparency processing!")
