#!/usr/bin/env python3
import os
import re
import glob

# Directory containing HTML files
html_dir = '/Users/aliakkas/apps/vscode/tables-explorer/presentation/html'

# Get all HTML files and sort them
html_files = sorted(glob.glob(os.path.join(html_dir, 'slide*.html')))
total_slides = len(html_files)

# Add navigation to each file
for i, file_path in enumerate(html_files):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Add CSS link if not already present
    if '<link rel="stylesheet" href="navigation.css" />' not in content:
        content = content.replace('<head>', '<head>\n  <link rel="stylesheet" href="navigation.css" />')
    
    # Determine previous and next slide files
    prev_file = html_files[i-1].split('/')[-1] if i > 0 else None
    next_file = html_files[i+1].split('/')[-1] if i < total_slides - 1 else None
    
    # Create navigation HTML
    nav_html = '<div class="navigation-buttons">\n'
    
    if prev_file:
        nav_html += f'  <a class="nav-button" href="{prev_file}">Previous</a>\n'
    else:
        nav_html += '  <a class="nav-button disabled" href="#">Previous</a>\n'
    
    if next_file:
        nav_html += f'  <a class="nav-button" href="{next_file}">Next</a>\n'
    else:
        nav_html += '  <a class="nav-button disabled" href="#">Next</a>\n'
    
    nav_html += '</div>\n'
    nav_html += f'<div class="slide-counter">Slide {i+1} of {total_slides}</div>\n'
    
    # Add navigation before closing body tag
    if '</body>' in content:
        content = content.replace('</body>', f'{nav_html}</body>')
    
    # Write the modified content back to the file
    with open(file_path, 'w') as file:
        file.write(content)

print(f"Added navigation to {total_slides} slides.")