#!/usr/bin/env bash

set -e

get_changed_files() {
  pHEAD=$1
  nHEAD=$2
  git diff-tree -r --name-only --no-commit-id $pHEAD $nHEAD
}

check_run() {
  if echo "$changed_files" | grep --quiet "$1"; then
    echo "$1 has changed! Executing -> \`$2\`"
    eval "$2"
  fi
}

check_deps() {
  # node - use whichever works for you
  # check_run yarn.lock "yarn install"
  check_run package-lock.json "npm install"

  # python
  check_run requirements.txt "pip install -r requirements.txt"

  # composer
  # check_run composer.lock "composer install"
}
