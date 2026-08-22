import os
import re

directories = [r'c:\globetrotter\frontend\src\pages', r'c:\globetrotter\frontend\src\components']
pattern = re.compile(r'https://images\.unsplash\.com/[^\'\"`]+')

seed_counter = 100
for directory in directories:
    for filename in os.listdir(directory):
        if filename.endswith('.jsx'):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            def replacer(match):
                global seed_counter
                res = f'https://picsum.photos/seed/globetrotter{seed_counter}/800/600'
                seed_counter += 1
                return res

            new_content = pattern.sub(replacer, content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated {filename}')
