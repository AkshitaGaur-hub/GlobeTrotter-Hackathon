import os
import re

image_map = {
    # Search.jsx
    "Eiffel Tower": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
    "Louvre Museum": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/800px-Louvre_Museum_Wikimedia_Commons.jpg",
    "Central Park": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg/800px-Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg",
    "Mount Fuji": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/080103_hakkai_fuji.jpg/800px-080103_hakkai_fuji.jpg",
    "Taj Mahal": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpg/800px-Taj_Mahal_%28Edited%29.jpg",
    "Machu Picchu": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/800px-Machu_Picchu%2C_Peru.jpg",
    "Serengeti National Park": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Tanzania_-_Serengeti_-_041.jpg/800px-Tanzania_-_Serengeti_-_041.jpg",
    "Angkor Wat": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Ankor_Wat_temple.jpg/800px-Ankor_Wat_temple.jpg",

    # TripPlanner.jsx
    "Colosseum": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg",
    "Santorini": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Oia%2C_Santorini.jpg/800px-Oia%2C_Santorini.jpg",
    "Grand Canyon": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Canyon_de_Chelly_panorama_of_valley_from_Spider_Rock_overlook.jpg/800px-Canyon_de_Chelly_panorama_of_valley_from_Spider_Rock_overlook.jpg",
    "Northern Lights": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Aurora_Borealis_and_startrails.jpg/800px-Aurora_Borealis_and_startrails.jpg",

    # Dashboard Regions
    "name: \"Europe\"": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Neuschwanstein_Castle_LOC_print.jpg/800px-Neuschwanstein_Castle_LOC_print.jpg",
    "name: \"Asia\"": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Great_Wall_of_China_July_2006.JPG/800px-Great_Wall_of_China_July_2006.JPG",
    "name: \"North America\"": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Yosemite_Valley_from_Wawona_Tunnel_view%2C_historic_American_Landscapes_Survey.jpg/800px-Yosemite_Valley_from_Wawona_Tunnel_view%2C_historic_American_Landscapes_Survey.jpg",
    "name: \"South America\"": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Cristo_Redentor_-_Rio_de_Janeiro%2C_Brasil.jpg/800px-Cristo_Redentor_-_Rio_de_Janeiro%2C_Brasil.jpg",
    "name: \"Africa\"": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Giza_Pyramids.jpg/800px-Giza_Pyramids.jpg",

    # Dashboard / MyTrips / Profile Trips
    "title: 'Weekend Getaway'": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Long_Island_City_New_York_May_2015_panorama_3.jpg/800px-Long_Island_City_New_York_May_2015_panorama_3.jpg",
    "title: 'Summer in Paris'": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques_0002.jpg/800px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques_0002.jpg",
    "title: 'Tokyo Adventure'": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/800px-Skyscrapers_of_Shinjuku_2009_January.jpg",
    "title: 'European Summer Tour'": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques_0002.jpg/800px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques_0002.jpg",
    "title: 'Japan Cherry Blossom'": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kinkaku-ji_01.jpg/800px-Kinkaku-ji_01.jpg",
    "title: 'Kyoto Escapade'": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kinkaku-ji_01.jpg/800px-Kinkaku-ji_01.jpg",
    "title: 'Swiss Alps'": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Matterhorn_from_Gornergrat.jpg/800px-Matterhorn_from_Gornergrat.jpg",
    "title: 'New York City'": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg/800px-Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg",
    "title: 'London Calling'": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall_%28cropped%29.jpg/800px-Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall_%28cropped%29.jpg"
}

import re
url_pattern = re.compile(r'image:\s*[\'"`]https://picsum\.photos[^\'"`]+[\'"`]')

directory = r'c:\globetrotter\frontend\src\pages'
for filename in os.listdir(directory):
    if filename.endswith('.jsx'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        changed = False
        for i in range(len(lines)):
            line = lines[i]
            # See if line matches any key in image_map
            for key, new_url in image_map.items():
                if key in line:
                    # found the item, replace the image url on this line
                    new_line = url_pattern.sub(f'image: \'{new_url}\'', line)
                    if new_line != line:
                        lines[i] = new_line
                        changed = True
        
        if changed:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            print(f'Updated exact locations in {filename}')

