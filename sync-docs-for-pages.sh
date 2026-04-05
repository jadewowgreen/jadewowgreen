#!/usr/bin/env bash
# Keep docs/ in sync when GitHub Pages publishes from the /docs folder.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
mkdir -p docs/site docs/images
rsync -a --delete --exclude '.DS_Store' site/ docs/site/
rsync -a --delete --exclude '.DS_Store' images/ docs/images/
: > docs/.nojekyll
cp index.html docs/index.html
echo "Synced docs/ from site/ and images/. Commit and push (including the jadewowgreen mirror if you use it for Pages)."
