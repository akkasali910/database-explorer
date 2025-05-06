#!/bin/bash
# This script generates a PDF from all Markdown slides

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "Error: pandoc is not installed. Please install it first."
    echo "Visit https://pandoc.org/installing.html for installation instructions."
    exit 1
fi

# Create a temporary file with all slides combined
echo "Combining slides..."
cat slide*.md > all_slides.md

# Convert to PDF
echo "Generating PDF..."
pandoc all_slides.md -o database-explorer-presentation.pdf --pdf-engine=pdflatex

# Clean up
rm all_slides.md

echo "PDF generation complete: database-explorer-presentation.pdf"
