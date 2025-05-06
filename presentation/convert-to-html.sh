#!/bin/bash
# This script converts Markdown slides to HTML

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "Error: pandoc is not installed. Please install it first."
    echo "Visit https://pandoc.org/installing.html for installation instructions."
    exit 1
fi

# Create output directory
mkdir -p html

# Convert each Markdown file to HTML
for file in slide*.md; do
    echo "Converting $file to HTML..."
    basename=$(basename "$file" .md)
    pandoc "$file" -o "html/$basename.html" --standalone --metadata title="Database Explorer"
done

echo "Conversion complete. HTML files are in the 'html' directory."
