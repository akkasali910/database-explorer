#!/usr/bin/env python3
import os
import glob

# Directory containing HTML files
html_dir = '/Users/aliakkas/apps/vscode/tables-explorer/presentation/html'

# Get all HTML files
html_files = glob.glob(os.path.join(html_dir, 'slide*.html'))

# Add keyboard.js script to each file
for file_path in html_files:
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Add script tag before closing body tag if not already present
    if '<script src="keyboard.js"></script>' not in content:
        content = content.replace('</body>', '<script src="keyboard.js"></script>\n</body>')
    
    # Write the modified content back to the file
    with open(file_path, 'w') as file:
        file.write(content)

print(f"Added keyboard navigation to {len(html_files)} slides.")