from PIL import Image

def find_grid(path):
    img = Image.open(path).convert('RGBA')
    w, h = img.size
    print(f"\nGrid analysis for {path}:")
    
    # Let's inspect pixels along the top edge (y=5) to see the grid pattern
    row = [img.getpixel((x, 5)) for x in range(w)]
    
    # Find transition points where color changes significantly
    transitions = []
    prev_color = row[0]
    for x in range(1, w):
        curr_color = row[x]
        # Euclidean distance in RGB
        dist = sum((a - b)**2 for a, b in zip(prev_color[:3], curr_color[:3]))**0.5
        if dist > 15: # Significant color change
            transitions.append((x, curr_color))
            prev_color = curr_color
            
    print(f"Number of transitions along top row: {len(transitions)}")
    if len(transitions) > 1:
        # Calculate grid square size from the distance between transitions
        diffs = [transitions[i][0] - transitions[i-1][0] for i in range(1, len(transitions))]
        print(f"Detected grid square sizes (first 10): {diffs[:10]}")
        # The most common diff is the grid size
        from collections import Counter
        grid_size = Counter(diffs).most_common(1)[0][0]
        print(f"Most common grid size: {grid_size}px")
        return grid_size
    return None

find_grid('public/yb-logo-light.png')
find_grid('public/yb-logo-dark.png')
