import os
import re

image_map = {
    # Search.jsx
    "Eiffel Tower": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80",
    "Louvre Museum": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
    "Central Park": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    "Mount Fuji": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    "Taj Mahal": "https://images.unsplash.com/photo-1564507592208-028bb465c14f?auto=format&fit=crop&w=800&q=80",
    "Machu Picchu": "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
    "Serengeti National Park": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80",
    "Angkor Wat": "https://images.unsplash.com/photo-1600803730598-a28a3915bc32?auto=format&fit=crop&w=800&q=80",

    # TripPlanner.jsx
    "Colosseum": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    "Santorini": "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=80",
    "Grand Canyon": "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=80",
    "Northern Lights": "https://images.unsplash.com/photo-1579033461387-9bb3a6479713?auto=format&fit=crop&w=800&q=80",

    # Dashboard Regions
    "name: \"Europe\"": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
    "name: \"Asia\"": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    "name: \"North America\"": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    "name: \"South America\"": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80",
    "name: \"Africa\"": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80",

    # Dashboard / MyTrips / Profile Trips
    "title: 'Weekend Getaway'": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    "title: 'Summer in Paris'": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    "title: 'Tokyo Adventure'": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    "title: 'European Summer Tour'": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    "title: 'Japan Cherry Blossom'": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    "title: 'Kyoto Escapade'": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    "title: 'Swiss Alps'": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    "title: 'New York City'": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    "title: 'London Calling'": "https://images.unsplash.com/photo-1513635269975-59693e2d8400?auto=format&fit=crop&w=800&q=80"
}

url_pattern = re.compile(r'image:\s*[\'"`]https://upload\.wikimedia\.org[^\'"`]+[\'"`]')

directory = r'c:\globetrotter\frontend\src\pages'
for filename in os.listdir(directory):
    if filename.endswith('.jsx'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        changed = False
        for i in range(len(lines)):
            line = lines[i]
            for key, new_url in image_map.items():
                if key in line:
                    new_line = url_pattern.sub(f'image: \'{new_url}\'', line)
                    if new_line != line:
                        lines[i] = new_line
                        changed = True
        
        if changed:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            print(f'Restored original Unsplash images in {filename}')

