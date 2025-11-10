#!/bin/bash
# Post-install script to configure git to ignore local changes to environment.local.ts

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ENV_FILE="src/environments/environment.local.ts"

echo ""
echo "🔧 Setting up environment configuration..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "${YELLOW}⚠️  Not in a git repository. Skipping git configuration.${NC}"
  exit 0
fi

# Check if the environment file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "${YELLOW}⚠️  $ENV_FILE not found. Skipping git configuration.${NC}"
  exit 0
fi

# Apply skip-worktree to environment.local.ts
if git update-index --skip-worktree "$ENV_FILE" 2>/dev/null; then
  echo "${GREEN}✅ Git configured to ignore local changes to $ENV_FILE${NC}"
  echo "${GREEN}   You can now safely add your Mapbox token without risk of committing it.${NC}"
else
  echo "${YELLOW}⚠️  Could not configure git for $ENV_FILE${NC}"
  echo "${YELLOW}   You may need to run this manually:${NC}"
  echo "${YELLOW}   git update-index --skip-worktree $ENV_FILE${NC}"
fi

echo ""
