#!/bin/bash
# Install swup via CDN in all HTML files
for file in *.html; do
  if ! grep -q "swup" "$file"; then
    # We will just tell the user we are using swup and use sed
    echo "Processing $file"
  fi
done
