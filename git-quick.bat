@echo off
git add --all --exclude=frontend/.env --exclude=backend/.env
git commit -m "quick update"
git push