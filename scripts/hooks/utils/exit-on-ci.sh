#!/usr/bin/env bash

set -e

# If is CI envirnoment ignore executing this post-checkout hook
if [[ -v $CI ]]; then
  exit 0
fi
